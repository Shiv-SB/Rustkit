/// Scales logits by `1 / temperature` in place: `a[i] /= temperature`.
/// `temperature` must be positive; the TS wrapper validates this.
///
/// TODO(sampling): implement. Stub currently leaves `a` unchanged.
pub fn temperature_f32(_a: &mut [f32], _temperature: f32) {
    // Stub — implemented via TDD.
}