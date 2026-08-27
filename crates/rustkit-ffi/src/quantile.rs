#[unsafe(no_mangle)]
pub unsafe extern "C" fn rk_quantile_t_digest_add(
    centroids_mean: *mut f32,
    centroids_count: *mut f32,
    num_centroids: *mut usize,
    max_centroids: usize,
    value: f32,
) {
    if centroids_mean.is_null() || centroids_count.is_null() || num_centroids.is_null() {
        return;
    }

    let mean_slice = unsafe { std::slice::from_raw_parts_mut(centroids_mean, max_centroids) };
    let count_slice = unsafe { std::slice::from_raw_parts_mut(centroids_count, max_centroids) };
    let num = unsafe { &mut *num_centroids };

    rustkit_core::quantile::t_digest_add(mean_slice, count_slice, num, value);
}

#[unsafe(no_mangle)]
pub unsafe extern "C" fn rk_quantile_t_digest_quantile(
    centroids_mean: *const f32,
    centroids_count: *const f32,
    num_centroids: usize,
    q: f32,
) -> f32 {
    if centroids_mean.is_null() || centroids_count.is_null() {
        return 0.0;
    }

    let mean_slice = unsafe { std::slice::from_raw_parts(centroids_mean, num_centroids) };
    let count_slice = unsafe { std::slice::from_raw_parts(centroids_count, num_centroids) };

    rustkit_core::quantile::t_digest_quantile(mean_slice, count_slice, num_centroids, q)
}

#[unsafe(no_mangle)]
pub unsafe extern "C" fn rk_quantile_count_min_sketch_add(
    table: *mut u32,
    depth: usize,
    width: usize,
    item: *const u8,
    item_len: usize,
) {
    if table.is_null() || item.is_null() {
        return;
    }

    let table_slice = unsafe { std::slice::from_raw_parts_mut(table, depth * width) };
    let item_slice = unsafe { std::slice::from_raw_parts(item, item_len) };

    rustkit_core::quantile::count_min_sketch_add(table_slice, depth, width, item_slice);
}

#[unsafe(no_mangle)]
pub unsafe extern "C" fn rk_quantile_bloom_filter_insert(
    bits: *mut u64,
    num_bits: usize,
    item: *const u8,
    item_len: usize,
    num_hashes: usize,
) {
    if bits.is_null() || item.is_null() {
        return;
    }

    let bits_slice = unsafe { std::slice::from_raw_parts_mut(bits, (num_bits + 63) / 64) };
    let item_slice = unsafe { std::slice::from_raw_parts(item, item_len) };

    rustkit_core::quantile::bloom_filter_insert(bits_slice, num_bits, item_slice, num_hashes);
}
