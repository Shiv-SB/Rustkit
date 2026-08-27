#[unsafe(no_mangle)]
pub unsafe extern "C" fn rk_sort_quicksort_i32(
    a: *mut i32,
    len: usize,
) {
    if a.is_null() || len == 0 {
        return;
    }

    let a_slice = unsafe { std::slice::from_raw_parts_mut(a, len) };

    rustkit_core::sort::quicksort_i32(a_slice);
}

#[unsafe(no_mangle)]
pub unsafe extern "C" fn rk_sort_argsort_f32(
    a: *const f32,
    out: *mut usize,
    len: usize,
) {
    if a.is_null() || out.is_null() || len == 0 {
        return;
    }

    let a_slice = unsafe { std::slice::from_raw_parts(a, len) };
    let out_slice = unsafe { std::slice::from_raw_parts_mut(out, len) };

    rustkit_core::sort::argsort_f32(a_slice, out_slice);
}

#[unsafe(no_mangle)]
pub unsafe extern "C" fn rk_sort_is_sorted_i32(
    a: *const i32,
    len: usize,
) -> bool {
    if a.is_null() || len == 0 {
        return true;
    }

    let a_slice = unsafe { std::slice::from_raw_parts(a, len) };

    rustkit_core::sort::is_sorted_i32(a_slice)
}

#[unsafe(no_mangle)]
pub unsafe extern "C" fn rk_sort_select_kth_i32(
    a: *mut i32,
    len: usize,
    k: usize,
) -> i32 {
    if a.is_null() || len == 0 || k >= len {
        return 0;
    }

    let a_slice = unsafe { std::slice::from_raw_parts_mut(a, len) };

    rustkit_core::sort::select_kth_i32(a_slice, k)
}
