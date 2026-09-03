/// Keeps only the `k` largest logits and sets every other element to
/// `-infinity` in place. `k` must be in `1..=a.len()`; the TS wrapper
/// validates this.
///
/// TODO(sampling): implement. Stub currently leaves `a` unchanged.
pub fn top_k_f32(_a: &mut [f32], _k: usize) {
    // Stub — implemented via TDD.
}