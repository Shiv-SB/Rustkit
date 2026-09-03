/// Nucleus sampling. `a` is a probability distribution (values in `[0, 1]`,
/// typically summing to 1). Keeps the smallest set of tokens whose cumulative
/// probability (taken from the highest down) reaches `p`, zeroes the rest,
/// and renormalizes in place. `p` must be in `[0, 1]`; the TS wrapper
/// validates this.
///
/// TODO(sampling): implement. Stub currently leaves `a` unchanged.
pub fn top_p_f32(_a: &mut [f32], _p: f32) {
    // Stub — implemented via TDD.
}