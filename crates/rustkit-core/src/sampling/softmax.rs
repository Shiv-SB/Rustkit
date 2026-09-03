use crate::simd;

/// Applies the numerically stable softmax to `a` in place:
/// `a[i] = exp(a[i] - max) / sum(exp(a[j] - max))`.
///
/// The max reduction and the exponential sum both use the explicit SIMD
/// kernels in [`crate::simd`]; the exp and normalize passes auto-vectorize
/// in release builds.
pub fn softmax_f32(a: &mut [f32]) {
    if a.is_empty() {
        return;
    }

    let max = simd::max_f32(a);

    for x in a.iter_mut() {
        *x = (*x - max).exp();
    }

    let sum = simd::sum_f32(a);

    if sum > 0.0 {
        for x in a.iter_mut() {
            *x /= sum;
        }
    }
}