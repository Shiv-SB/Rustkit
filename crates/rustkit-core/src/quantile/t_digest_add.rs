pub fn t_digest_add(
    centroids_mean: &mut [f32],
    centroids_count: &mut [f32],
    num_centroids: &mut usize,
    value: f32,
) {
    let n = *num_centroids;
    if n >= centroids_mean.len() || n >= centroids_count.len() {
        return;
    }

    centroids_mean[n] = value;
    centroids_count[n] = 1.0;
    *num_centroids = n + 1;
}
