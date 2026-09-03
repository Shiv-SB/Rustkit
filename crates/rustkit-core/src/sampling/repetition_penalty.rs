/// Applies a repetition penalty to the logits of tokens whose ids appear in
/// `seen`, in place: positive logits are divided by `penalty`, negative
/// logits are multiplied by `penalty`. A penalty of `1` is the identity.
/// `penalty` must be non-negative and `seen` entries must be valid indices;
/// the TS wrapper validates both.
///
/// TODO(sampling): implement. Stub currently leaves `a` unchanged.
pub fn repetition_penalty_f32(_a: &mut [f32], _penalty: f32, _seen: &[u32]) {
    // Stub — implemented via TDD.
}