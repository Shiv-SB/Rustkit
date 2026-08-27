#[unsafe(no_mangle)]
pub unsafe extern "C" fn rk_search_binary_search_i32(
    a: *const i32,
    len: usize,
    target: i32,
    out: *mut usize,
) -> bool {
    if a.is_null() || out.is_null() || len == 0 {
        return false;
    }

    let a_slice = unsafe { std::slice::from_raw_parts(a, len) };

    match rustkit_core::search::binary_search_i32(a_slice, target) {
        Some(idx) => {
            unsafe { *out = idx; }
            true
        }
        None => false,
    }
}

#[unsafe(no_mangle)]
pub unsafe extern "C" fn rk_search_lower_bound_i32(
    a: *const i32,
    len: usize,
    target: i32,
) -> usize {
    if a.is_null() || len == 0 {
        return 0;
    }

    let a_slice = unsafe { std::slice::from_raw_parts(a, len) };

    rustkit_core::search::lower_bound_i32(a_slice, target)
}

#[unsafe(no_mangle)]
pub unsafe extern "C" fn rk_search_upper_bound_i32(
    a: *const i32,
    len: usize,
    target: i32,
) -> usize {
    if a.is_null() || len == 0 {
        return 0;
    }

    let a_slice = unsafe { std::slice::from_raw_parts(a, len) };

    rustkit_core::search::upper_bound_i32(a_slice, target)
}

#[unsafe(no_mangle)]
pub unsafe extern "C" fn rk_search_linear_search_i32(
    a: *const i32,
    len: usize,
    target: i32,
    out: *mut usize,
) -> bool {
    if a.is_null() || out.is_null() || len == 0 {
        return false;
    }

    let a_slice = unsafe { std::slice::from_raw_parts(a, len) };

    match rustkit_core::search::linear_search_i32(a_slice, target) {
        Some(idx) => {
            unsafe { *out = idx; }
            true
        }
        None => false,
    }
}
