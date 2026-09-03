/// Scales logits by `1 / temperature` in place: `a[i] /= temperature`.
/// `temperature` must be positive; the TS wrapper validates this.
pub fn temperature_f32(a: &mut [f32], temperature: f32) {
    if temperature <= 0.0 {
        return;
    }

    for x in a.iter_mut() {
        *x /= temperature;
    }
}