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

#[unsafe(no_mangle)]
pub unsafe extern "C" fn rk_quantile_count_min_sketch_query(
    table: *const u32,
    depth: usize,
    width: usize,
    item: *const u8,
    item_len: usize,
) -> u32 {
    if table.is_null() || item.is_null() {
        return 0;
    }

    let table_slice = unsafe { std::slice::from_raw_parts(table, depth * width) };
    let item_slice = unsafe { std::slice::from_raw_parts(item, item_len) };

    rustkit_core::quantile::count_min_sketch_query(table_slice, depth, width, item_slice)
}

#[unsafe(no_mangle)]
pub unsafe extern "C" fn rk_quantile_bloom_filter_contains(
    bits: *const u64,
    num_bits: usize,
    item: *const u8,
    item_len: usize,
    num_hashes: usize,
) -> bool {
    if bits.is_null() || item.is_null() {
        return false;
    }

    let bits_slice = unsafe { std::slice::from_raw_parts(bits, (num_bits + 63) / 64) };
    let item_slice = unsafe { std::slice::from_raw_parts(item, item_len) };

    rustkit_core::quantile::bloom_filter_contains(bits_slice, num_bits, item_slice, num_hashes)
}

#[unsafe(no_mangle)]
pub unsafe extern "C" fn rk_quantile_hyperloglog_create(
    precision: usize,
    out: *mut u8,
    out_len: usize,
) {
    if out.is_null() {
        return;
    }

    let out_slice = unsafe { std::slice::from_raw_parts_mut(out, out_len) };
    let sketch = rustkit_core::quantile::hyperloglog_create(precision);
    let n = sketch.len().min(out_len);
    out_slice[..n].copy_from_slice(&sketch[..n]);
}

#[unsafe(no_mangle)]
pub unsafe extern "C" fn rk_quantile_hyperloglog_add(
    sketch: *mut u8,
    sketch_len: usize,
    item: *const u8,
    item_len: usize,
) {
    if sketch.is_null() || item.is_null() {
        return;
    }

    let sketch_slice = unsafe { std::slice::from_raw_parts_mut(sketch, sketch_len) };
    let item_slice = unsafe { std::slice::from_raw_parts(item, item_len) };

    rustkit_core::quantile::hyperloglog_add(sketch_slice, item_slice);
}

#[unsafe(no_mangle)]
pub unsafe extern "C" fn rk_quantile_hyperloglog_estimate(
    sketch: *const u8,
    sketch_len: usize,
) -> f64 {
    if sketch.is_null() {
        return 0.0;
    }

    let sketch_slice = unsafe { std::slice::from_raw_parts(sketch, sketch_len) };

    rustkit_core::quantile::hyperloglog_estimate(sketch_slice)
}

#[unsafe(no_mangle)]
pub unsafe extern "C" fn rk_quantile_minhash_create(
    num_hashes: usize,
    out: *mut u32,
    out_len: usize,
) {
    if out.is_null() {
        return;
    }

    let out_slice = unsafe { std::slice::from_raw_parts_mut(out, out_len) };
    let signature = rustkit_core::quantile::minhash_create(num_hashes);
    let n = signature.len().min(out_len);
    out_slice[..n].copy_from_slice(&signature[..n]);
}

#[unsafe(no_mangle)]
pub unsafe extern "C" fn rk_quantile_minhash_add(
    signature: *mut u32,
    signature_len: usize,
    item: *const u8,
    item_len: usize,
) {
    if signature.is_null() || item.is_null() {
        return;
    }

    let signature_slice = unsafe { std::slice::from_raw_parts_mut(signature, signature_len) };
    let item_slice = unsafe { std::slice::from_raw_parts(item, item_len) };

    rustkit_core::quantile::minhash_add(signature_slice, item_slice);
}

#[unsafe(no_mangle)]
pub unsafe extern "C" fn rk_quantile_minhash_similarity(
    a: *const u32,
    a_len: usize,
    b: *const u32,
    b_len: usize,
) -> f32 {
    if a.is_null() || b.is_null() {
        return 0.0;
    }

    let a_slice = unsafe { std::slice::from_raw_parts(a, a_len) };
    let b_slice = unsafe { std::slice::from_raw_parts(b, b_len) };

    rustkit_core::quantile::minhash_similarity(a_slice, b_slice)
}
