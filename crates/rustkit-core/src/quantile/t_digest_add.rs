pub fn t_digest_add(
    centroids_mean: &mut [f32],
    centroids_count: &mut [f32],
    num_centroids: usize,
    value: f32,
) -> usize {
    if num_centroids >= centroids_mean.len() || num_centroids >= centroids_count.len() {
        return num_centroids;
    }

    centroids_mean[num_centroids] = value;
    centroids_count[num_centroids] = 1.0;
    num_centroids + 1
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn adds_and_returns_new_count() {
        let mut means = [0.0f32; 4];
        let mut counts = [0.0f32; 4];
        let n = t_digest_add(&mut means, &mut counts, 0, 42.0);
        assert_eq!(n, 1);
        assert_eq!(means[0], 42.0);
        assert_eq!(counts[0], 1.0);
    }

    #[test]
    fn full_digest_returns_unchanged_count() {
        let mut means = [0.0f32; 2];
        let mut counts = [0.0f32; 2];
        let n = t_digest_add(&mut means, &mut counts, 2, 42.0);
        assert_eq!(n, 2);
        assert_eq!(means[1], 0.0);
    }
}