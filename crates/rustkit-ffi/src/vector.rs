#[unsafe(no_mangle)]
pub unsafe extern "C" fn rk_vector_add_f32(
    a: *const f32,
    b: *const f32,
    out: *mut f32,
    len: usize,
) {
    if a.is_null() || b.is_null() || out.is_null() {
        return;
    }

    let a_slice = unsafe { std::slice::from_raw_parts(a, len) };
    let b_slice = unsafe { std::slice::from_raw_parts(b, len) };
    let out_slice = unsafe { std::slice::from_raw_parts_mut(out, len) };

    rustkit_core::vector::add_f32(a_slice, b_slice, out_slice);
}

#[unsafe(no_mangle)]
pub unsafe extern "C" fn rk_vector_sub_f32(
    a: *const f32,
    b: *const f32,
    out: *mut f32,
    len: usize,
) {
    if a.is_null() || b.is_null() || out.is_null() {
        return;
    }

    let a_slice = unsafe { std::slice::from_raw_parts(a, len) };
    let b_slice = unsafe { std::slice::from_raw_parts(b, len) };
    let out_slice = unsafe { std::slice::from_raw_parts_mut(out, len) };

    rustkit_core::vector::sub_f32(a_slice, b_slice, out_slice);
}

#[unsafe(no_mangle)]
pub unsafe extern "C" fn rk_vector_mul_f32(
    a: *const f32,
    b: *const f32,
    out: *mut f32,
    len: usize,
) {
    if a.is_null() || b.is_null() || out.is_null() {
        return;
    }

    let a_slice = unsafe { std::slice::from_raw_parts(a, len) };
    let b_slice = unsafe { std::slice::from_raw_parts(b, len) };
    let out_slice = unsafe { std::slice::from_raw_parts_mut(out, len) };

    rustkit_core::vector::mul_f32(a_slice, b_slice, out_slice);
}

#[unsafe(no_mangle)]
pub unsafe extern "C" fn rk_vector_div_f32(
    a: *const f32,
    b: *const f32,
    out: *mut f32,
    len: usize,
) {
    if a.is_null() || b.is_null() || out.is_null() {
        return;
    }

    let a_slice = unsafe { std::slice::from_raw_parts(a, len) };
    let b_slice = unsafe { std::slice::from_raw_parts(b, len) };
    let out_slice = unsafe { std::slice::from_raw_parts_mut(out, len) };

    rustkit_core::vector::div_f32(a_slice, b_slice, out_slice);
}

#[unsafe(no_mangle)]
pub unsafe extern "C" fn rk_vector_dot_f32(
    a: *const f32,
    b: *const f32,
    len: usize,
) -> f32 {
    if a.is_null() || b.is_null() {
        return 0.0;
    }

    let a_slice = unsafe { std::slice::from_raw_parts(a, len) };
    let b_slice = unsafe { std::slice::from_raw_parts(b, len) };

    rustkit_core::vector::dot_f32(a_slice, b_slice)
}

#[unsafe(no_mangle)]
pub unsafe extern "C" fn rk_vector_cross_f32(
    a: *const f32,
    b: *const f32,
    out: *mut f32,
    len: usize,
) {
    if a.is_null() || b.is_null() || out.is_null() {
        return;
    }

    let a_slice = unsafe { std::slice::from_raw_parts(a, len) };
    let b_slice = unsafe { std::slice::from_raw_parts(b, len) };
    let out_slice = unsafe { std::slice::from_raw_parts_mut(out, len) };

    rustkit_core::vector::cross_f32(a_slice, b_slice, out_slice);
}

#[unsafe(no_mangle)]
pub unsafe extern "C" fn rk_vector_norm_f32(
    a: *const f32,
    len: usize,
) -> f32 {
    if a.is_null() {
        return 0.0;
    }

    let a_slice = unsafe { std::slice::from_raw_parts(a, len) };

    rustkit_core::vector::norm_f32(a_slice)
}

#[unsafe(no_mangle)]
pub unsafe extern "C" fn rk_vector_normalize_f32(
    a: *const f32,
    out: *mut f32,
    len: usize,
) {
    if a.is_null() || out.is_null() {
        return;
    }

    let a_slice = unsafe { std::slice::from_raw_parts(a, len) };
    let out_slice = unsafe { std::slice::from_raw_parts_mut(out, len) };

    rustkit_core::vector::normalize_f32(a_slice, out_slice);
}

#[unsafe(no_mangle)]
pub unsafe extern "C" fn rk_vector_scale_f32(
    a: *const f32,
    scalar: f32,
    out: *mut f32,
    len: usize,
) {
    if a.is_null() || out.is_null() {
        return;
    }

    let a_slice = unsafe { std::slice::from_raw_parts(a, len) };
    let out_slice = unsafe { std::slice::from_raw_parts_mut(out, len) };

    rustkit_core::vector::scale_f32(a_slice, scalar, out_slice);
}

#[unsafe(no_mangle)]
pub unsafe extern "C" fn rk_vector_argmin_f32(
    a: *const f32,
    len: usize,
) -> usize {
    if a.is_null() || len == 0 {
        return 0;
    }

    let a_slice = unsafe { std::slice::from_raw_parts(a, len) };

    rustkit_core::vector::argmin_f32(a_slice)
}

#[unsafe(no_mangle)]
pub unsafe extern "C" fn rk_vector_argmax_f32(
    a: *const f32,
    len: usize,
) -> usize {
    if a.is_null() || len == 0 {
        return 0;
    }

    let a_slice = unsafe { std::slice::from_raw_parts(a, len) };

    rustkit_core::vector::argmax_f32(a_slice)
}

#[unsafe(no_mangle)]
pub unsafe extern "C" fn rk_vector_fill_f32(
    out: *mut f32,
    val: f32,
    len: usize,
) {
    if out.is_null() {
        return;
    }

    let out_slice = unsafe { std::slice::from_raw_parts_mut(out, len) };

    rustkit_core::vector::fill_f32(out_slice, val);
}

#[unsafe(no_mangle)]
pub unsafe extern "C" fn rk_vector_zero_f32(
    out: *mut f32,
    len: usize,
) {
    if out.is_null() {
        return;
    }

    let out_slice = unsafe { std::slice::from_raw_parts_mut(out, len) };

    rustkit_core::vector::zero_f32(out_slice);
}

#[unsafe(no_mangle)]
pub unsafe extern "C" fn rk_vector_sum_f32(
    a: *const f32,
    len: usize,
) -> f32 {
    if a.is_null() || len == 0 {
        return 0.0;
    }

    let a_slice = unsafe { std::slice::from_raw_parts(a, len) };

    rustkit_core::vector::sum_f32(a_slice)
}

#[unsafe(no_mangle)]
pub unsafe extern "C" fn rk_vector_mean_f32(
    a: *const f32,
    len: usize,
) -> f32 {
    if a.is_null() || len == 0 {
        return 0.0;
    }

    let a_slice = unsafe { std::slice::from_raw_parts(a, len) };

    rustkit_core::vector::mean_f32(a_slice)
}

#[unsafe(no_mangle)]
pub unsafe extern "C" fn rk_vector_lerp_f32(
    a: *const f32,
    b: *const f32,
    t: f32,
    out: *mut f32,
    len: usize,
) {
    if a.is_null() || b.is_null() || out.is_null() {
        return;
    }

    let a_slice = unsafe { std::slice::from_raw_parts(a, len) };
    let b_slice = unsafe { std::slice::from_raw_parts(b, len) };
    let out_slice = unsafe { std::slice::from_raw_parts_mut(out, len) };

    rustkit_core::vector::lerp_f32(a_slice, b_slice, t, out_slice);
}

#[unsafe(no_mangle)]
pub unsafe extern "C" fn rk_vector_clamp_f32(
    a: *mut f32,
    min: f32,
    max: f32,
    len: usize,
) {
    if a.is_null() {
        return;
    }

    let a_slice = unsafe { std::slice::from_raw_parts_mut(a, len) };

    rustkit_core::vector::clamp_f32(a_slice, min, max);
}

#[unsafe(no_mangle)]
pub unsafe extern "C" fn rk_vector_sort_f32(
    a: *mut f32,
    len: usize,
) {
    if a.is_null() {
        return;
    }

    let a_slice = unsafe { std::slice::from_raw_parts_mut(a, len) };

    rustkit_core::vector::sort_f32(a_slice);
}
