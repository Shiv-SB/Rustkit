use crate::simd;

pub fn cosine_similarity_f32(a: &[f32], b: &[f32]) -> f32 {
    assert_eq!(a.len(), b.len());

    let dot = simd::dot_f32(a, b);
    let norm_a = simd::dot_f32(a, a).sqrt();
    let norm_b = simd::dot_f32(b, b).sqrt();

    if norm_a == 0.0 || norm_b == 0.0 {
        return 0.0;
    }

    dot / (norm_a * norm_b)
}