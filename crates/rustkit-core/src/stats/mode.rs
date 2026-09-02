use std::collections::HashMap;

// Returns the mode value(s). For simplicity return the most frequent value.
pub fn mode_f32(a: &[f32]) -> f32 {
    assert!(!a.is_empty());

    let mut counts: HashMap<u32, (u32, f32)> = HashMap::new();
    for &x in a {
        let entry = counts.entry(x.to_bits()).or_insert((0, x));
        entry.0 += 1;
    }

    counts
        .into_values()
        .max_by(|a, b| a.0.cmp(&b.0))
        .map(|(_, v)| v)
        .unwrap_or(a[0])
}
