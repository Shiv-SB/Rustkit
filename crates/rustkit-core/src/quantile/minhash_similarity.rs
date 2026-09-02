pub fn minhash_similarity(a: &[u32], b: &[u32]) -> f32 {
    assert_eq!(a.len(), b.len());
    assert!(!a.is_empty());

    let matches = a.iter().zip(b).filter(|(x, y)| x == y).count();
    matches as f32 / a.len() as f32
}
