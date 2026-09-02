pub fn t_digest_quantile(
    centroids_mean: &[f32],
    centroids_count: &[f32],
    num_centroids: usize,
    q: f32,
) -> f32 {
    if num_centroids == 0 {
        return 0.0;
    }
    if num_centroids == 1 {
        return centroids_mean[0];
    }

    let mut order: Vec<usize> = (0..num_centroids).collect();
    order.sort_by(|&i, &j| {
        centroids_mean[i]
            .partial_cmp(&centroids_mean[j])
            .unwrap_or(std::cmp::Ordering::Equal)
    });

    let total: f32 = centroids_count[..num_centroids].iter().sum();
    if total <= 0.0 {
        return centroids_mean[order[0]];
    }

    let target = q.clamp(0.0, 1.0) * total;
    let mut cum = 0.0f32;

    for w in 0..num_centroids {
        let i = order[w];
        let count = centroids_count[i];
        if target < cum + count {
            let prev_mean = if w == 0 {
                centroids_mean[i]
            } else {
                centroids_mean[order[w - 1]]
            };
            let frac = ((target - cum) / count.max(1.0)).clamp(0.0, 1.0);
            return prev_mean + frac * (centroids_mean[i] - prev_mean);
        }
        cum += count;
    }

    centroids_mean[order[num_centroids - 1]]
}
