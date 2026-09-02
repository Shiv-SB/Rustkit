pub fn bitset_and(a: &[u64], b: &[u64], out: &mut [u64]) {
    assert_eq!(a.len(), b.len());
    assert_eq!(a.len(), out.len());
    for ((o, &x), &y) in out.iter_mut().zip(a).zip(b) {
        *o = x & y;
    }
}
