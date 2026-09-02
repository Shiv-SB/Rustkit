use crate::crypto::murmur3;

pub fn count_min_sketch_add(table: &mut [u32], depth: usize, width: usize, item: &[u8]) {
    assert_eq!(table.len(), depth * width);

    for d in 0..depth {
        let hash = murmur3(item, d as u32) as usize % width;
        let idx = d * width + hash;
        table[idx] = table[idx].saturating_add(1);
    }
}
