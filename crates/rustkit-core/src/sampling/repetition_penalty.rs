/// Applies a repetition penalty to the logits of tokens whose ids appear in
/// `seen`, in place: positive logits are divided by `penalty`, negative
/// logits are multiplied by `penalty`. A penalty of `1` is the identity.
/// `penalty` must be non-negative and `seen` entries must be valid indices;
/// the TS wrapper validates both.
pub fn repetition_penalty_f32(a: &mut [f32], penalty: f32, seen: &[u32]) {
    if penalty <= 0.0 {
        return;
    }

    for &idx in seen {
        let idx = idx as usize;
        if idx >= a.len() {
            continue;
        }
        let x = a[idx];
        a[idx] = if x >= 0.0 { x / penalty } else { x * penalty };
    }
}