/// Applies the numerically stable softmax to `a` in place:
/// `a[i] = exp(a[i] - max) / sum(exp(a[j] - max))`.
///
/// TODO(sampling): implement. Stub currently leaves `a` unchanged.
pub fn softmax_f32(_a: &mut [f32]) {
    // Stub — implemented via TDD.
}