use std::collections::HashSet;

fn trigram_set(s: &[u8]) -> HashSet<u32> {
    let mut padded = Vec::with_capacity(s.len() + 4);
    padded.extend_from_slice(&[b' ', b' ']);
    padded.extend_from_slice(s);
    padded.extend_from_slice(&[b' ', b' ']);

    padded
        .windows(3)
        .map(|w| ((w[0] as u32) << 16) | ((w[1] as u32) << 8) | w[2] as u32)
        .collect()
}

pub fn trigram_similarity(a: &[u8], b: &[u8]) -> f32 {
    let trigrams_a = trigram_set(a);
    let trigrams_b = trigram_set(b);

    let intersection = trigrams_a.intersection(&trigrams_b).count();
    let union = trigrams_a.len() + trigrams_b.len() - intersection;

    if union == 0 {
        return 1.0;
    }

    intersection as f32 / union as f32
}
