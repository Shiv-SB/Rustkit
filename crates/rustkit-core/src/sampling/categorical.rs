use crate::simd;

/// Draws a categorical sample from the probability distribution `probs` using
/// a seedable PRNG, returning the sampled index. The result is deterministic
/// for a given `seed`, so sampling is reproducible across platforms.
pub fn categorical_f32(probs: &[f32], seed: u64) -> usize {
    if probs.is_empty() {
        return 0;
    }

    let total = simd::sum_f32(probs);
    if total <= 0.0 {
        return 0;
    }

    let mut state = seed;
    let r = uniform01(&mut state) * total as f64;

    let mut cumulative = 0.0f32;
    for (i, &p) in probs.iter().enumerate() {
        cumulative += p;
        if cumulative as f64 > r {
            return i;
        }
    }

    probs.len() - 1
}

/// wyrand (Wouter van Oortmerssen): a fast, seedable PRNG with good
/// statistical properties, used here for reproducible sampling.
fn next_u64(state: &mut u64) -> u64 {
    *state = state.wrapping_add(0xa076_1d64_78bd_642f);
    let t = u128::from(*state).wrapping_mul(u128::from(*state ^ 0xe703_7ed1_a0b4_28db));
    (t >> 64) as u64
}

/// Uniform value in `[0, 1)` from the top 53 bits of the PRNG output.
fn uniform01(state: &mut u64) -> f64 {
    ((next_u64(state) >> 11) as f64) * (1.0 / ((1u64 << 53) as f64))
}