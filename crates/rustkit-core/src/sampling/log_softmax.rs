use crate::simd;

/// Applies the numerically stable log-softmax to `a` in place:
/// `a[i] = (a[i] - max) - ln(sum(exp(a[j] - max)))`.
///
/// Uses the explicit SIMD kernels in [`crate::simd`] for the max reduction
/// and the exponential sum.
pub fn log_softmax_f32(a: &mut [f32]) {
    if a.is_empty() {
        return;
    }

    let max = simd::max_f32(a);

    for x in a.iter_mut() {
        *x = (*x - max).exp();
    }

    let sum = simd::sum_f32(a);
    let log_sum = sum.ln();

    for x in a.iter_mut() {
        *x = x.ln() - log_sum;
    }
}