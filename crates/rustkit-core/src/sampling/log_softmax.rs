/// Applies the numerically stable log-softmax to `a` in place:
/// `a[i] = (a[i] - max) - ln(sum(exp(a[j] - max)))`.
///
/// TODO(sampling): implement. Stub currently leaves `a` unchanged.
pub fn log_softmax_f32(_a: &mut [f32]) {
    // Stub — implemented via TDD.
}