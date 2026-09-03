/// Keeps only the `k` largest logits and sets every other element to
/// `-infinity` in place. `k` must be in `1..=a.len()`; the TS wrapper
/// validates this.
pub fn top_k_f32(a: &mut [f32], k: usize) {
    if a.is_empty() {
        return;
    }

    let k = k.min(a.len());
    let mut indices: Vec<usize> = (0..a.len()).collect();
    indices.sort_unstable_by(|&i, &j| {
        a[j].partial_cmp(&a[i]).unwrap_or(std::cmp::Ordering::Equal)
    });

    let mut keep = vec![false; a.len()];
    for &i in indices.iter().take(k) {
        keep[i] = true;
    }

    for (i, x) in a.iter_mut().enumerate() {
        if !keep[i] {
            *x = f32::NEG_INFINITY;
        }
    }
}