/// Returns the index of the largest logit (greedy decoding).
pub fn greedy_f32(a: &[f32]) -> usize {
    crate::vector::argmax_f32(a)
}