use crate::crypto::murmur3;

pub fn count_min_sketch_query(table: &[u32], depth: usize, width: usize, item: &[u8]) -> u32 {
    assert_eq!(table.len(), depth * width);

    (0..depth)
        .map(|d| {
            let hash = murmur3(item, d as u32) as usize % width;
            table[d * width + hash]
        })
        .min()
        .unwrap_or(0)
}
