#[unsafe(no_mangle)]
pub unsafe extern "C" fn rk_geohash_encode(
    lat: f64,
    lng: f64,
    precision: usize,
    out: *mut u8,
) {
    if out.is_null() {
        return;
    }

    let out_slice = unsafe { std::slice::from_raw_parts_mut(out, precision) };

    rustkit_core::geohash::encode(lat, lng, precision, out_slice);
}

#[unsafe(no_mangle)]
pub unsafe extern "C" fn rk_geohash_decode(
    hash: *const u8,
    hash_len: usize,
    lat: *mut f64,
    lng: *mut f64,
) {
    if hash.is_null() || lat.is_null() || lng.is_null() {
        return;
    }

    let hash_slice = unsafe { std::slice::from_raw_parts(hash, hash_len) };

    unsafe {
        rustkit_core::geohash::decode(hash_slice, &mut *lat, &mut *lng);
    }
}

#[unsafe(no_mangle)]
pub unsafe extern "C" fn rk_geohash_neighbor(
    hash: *const u8,
    hash_len: usize,
    direction: i32,
    out: *mut u8,
) {
    if hash.is_null() || out.is_null() {
        return;
    }

    let hash_slice = unsafe { std::slice::from_raw_parts(hash, hash_len) };
    let out_slice = unsafe { std::slice::from_raw_parts_mut(out, hash_len) };

    rustkit_core::geohash::neighbor(hash_slice, direction, out_slice);
}

#[unsafe(no_mangle)]
pub unsafe extern "C" fn rk_geohash_distance(
    a_lat: f64,
    a_lng: f64,
    b_lat: f64,
    b_lng: f64,
) -> f64 {
    rustkit_core::geohash::distance(a_lat, a_lng, b_lat, b_lng)
}

#[unsafe(no_mangle)]
pub unsafe extern "C" fn rk_geohash_is_valid(
    hash: *const u8,
    hash_len: usize,
) -> bool {
    if hash.is_null() {
        return false;
    }

    let hash_slice = unsafe { std::slice::from_raw_parts(hash, hash_len) };

    rustkit_core::geohash::is_valid(hash_slice)
}

#[unsafe(no_mangle)]
pub unsafe extern "C" fn rk_geohash_all_neighbors(
    hash: *const u8,
    hash_len: usize,
    out: *mut u8,
) {
    if hash.is_null() || out.is_null() {
        return;
    }

    let hash_slice = unsafe { std::slice::from_raw_parts(hash, hash_len) };
    let out_slice = unsafe { std::slice::from_raw_parts_mut(out, hash_len * 8) };

    rustkit_core::geohash::all_neighbors(hash_slice, out_slice);
}

#[unsafe(no_mangle)]
pub unsafe extern "C" fn rk_geohash_bbox(
    hash: *const u8,
    hash_len: usize,
    min_lat: *mut f64,
    min_lng: *mut f64,
    max_lat: *mut f64,
    max_lng: *mut f64,
) {
    if hash.is_null() || min_lat.is_null() || min_lng.is_null() || max_lat.is_null() || max_lng.is_null() {
        return;
    }

    let hash_slice = unsafe { std::slice::from_raw_parts(hash, hash_len) };

    unsafe {
        rustkit_core::geohash::bbox(hash_slice, &mut *min_lat, &mut *min_lng, &mut *max_lat, &mut *max_lng);
    }
}
