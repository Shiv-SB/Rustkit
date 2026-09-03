/// Min-p sampling. `a` is a probability distribution (values in `[0, 1]`).
/// Keeps tokens with probability `>= p * max(a)`, zeroes the rest, and
/// renormalizes in place. `p` must be in `[0, 1]`; the TS wrapper validates
/// this.
///
/// TODO(sampling): implement. Stub currently leaves `a` unchanged.
pub fn min_p_f32(_a: &mut [f32], _p: f32) {
    // Stub — implemented via TDD.
}