pub fn hamming_distance_i32(a: &[i32], b: &[i32]) -> usize {
    assert_eq!(a.len(), b.len());
    a.iter()
        .copied()
        .zip(b.iter().copied())
        .filter(|(x, y)| x != y)
        .count()
}