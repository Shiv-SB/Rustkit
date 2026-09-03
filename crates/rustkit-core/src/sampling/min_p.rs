use crate::simd;

/// Min-p sampling. `a` is a probability distribution (values in `[0, 1]`).
/// Keeps tokens with probability `>= p * max(a)`, zeroes the rest, and
/// renormalizes in place. `p` must be in `[0, 1]`; the TS wrapper validates
/// this.
pub fn min_p_f32(a: &mut [f32], p: f32) {
    if a.is_empty() {
        return;
    }

    let p = p.clamp(0.0, 1.0);
    let threshold = p * simd::max_f32(a);

    let mut sum = 0.0f32;
    for x in a.iter_mut() {
        if *x < threshold {
            *x = 0.0;
        }
        sum += *x;
    }

    if sum > 0.0 {
        for x in a.iter_mut() {
            *x /= sum;
        }
    }
}