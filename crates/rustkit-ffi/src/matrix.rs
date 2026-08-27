#[unsafe(no_mangle)]
pub unsafe extern "C" fn rk_matrix_mul_f32(
    a: *const f32,
    b: *const f32,
    out: *mut f32,
    rows_a: usize,
    cols_a: usize,
    cols_b: usize,
) {
    if a.is_null() || b.is_null() || out.is_null() {
        return;
    }

    let a_slice = unsafe { std::slice::from_raw_parts(a, rows_a * cols_a) };
    let b_slice = unsafe { std::slice::from_raw_parts(b, cols_a * cols_b) };
    let out_slice = unsafe { std::slice::from_raw_parts_mut(out, rows_a * cols_b) };

    rustkit_core::matrix::mul_f32(a_slice, b_slice, out_slice, rows_a, cols_a, cols_b);
}

#[unsafe(no_mangle)]
pub unsafe extern "C" fn rk_matrix_transpose_f32(
    a: *const f32,
    out: *mut f32,
    rows: usize,
    cols: usize,
) {
    if a.is_null() || out.is_null() {
        return;
    }

    let a_slice = unsafe { std::slice::from_raw_parts(a, rows * cols) };
    let out_slice = unsafe { std::slice::from_raw_parts_mut(out, rows * cols) };

    rustkit_core::matrix::transpose_f32(a_slice, out_slice, rows, cols);
}

#[unsafe(no_mangle)]
pub unsafe extern "C" fn rk_matrix_determinant_f32(
    a: *const f32,
    n: usize,
) -> f32 {
    if a.is_null() {
        return 0.0;
    }

    let a_slice = unsafe { std::slice::from_raw_parts(a, n * n) };

    rustkit_core::matrix::determinant_f32(a_slice, n)
}

#[unsafe(no_mangle)]
pub unsafe extern "C" fn rk_matrix_inverse_f32(
    a: *const f32,
    out: *mut f32,
    n: usize,
) -> bool {
    if a.is_null() || out.is_null() {
        return false;
    }

    let a_slice = unsafe { std::slice::from_raw_parts(a, n * n) };
    let out_slice = unsafe { std::slice::from_raw_parts_mut(out, n * n) };

    rustkit_core::matrix::inverse_f32(a_slice, out_slice, n)
}

#[unsafe(no_mangle)]
pub unsafe extern "C" fn rk_matrix_add_f32(
    a: *const f32,
    b: *const f32,
    out: *mut f32,
    rows: usize,
    cols: usize,
) {
    if a.is_null() || b.is_null() || out.is_null() {
        return;
    }

    let a_slice = unsafe { std::slice::from_raw_parts(a, rows * cols) };
    let b_slice = unsafe { std::slice::from_raw_parts(b, rows * cols) };
    let out_slice = unsafe { std::slice::from_raw_parts_mut(out, rows * cols) };

    rustkit_core::matrix::add_f32(a_slice, b_slice, out_slice, rows, cols);
}

#[unsafe(no_mangle)]
pub unsafe extern "C" fn rk_matrix_sub_f32(
    a: *const f32,
    b: *const f32,
    out: *mut f32,
    rows: usize,
    cols: usize,
) {
    if a.is_null() || b.is_null() || out.is_null() {
        return;
    }

    let a_slice = unsafe { std::slice::from_raw_parts(a, rows * cols) };
    let b_slice = unsafe { std::slice::from_raw_parts(b, rows * cols) };
    let out_slice = unsafe { std::slice::from_raw_parts_mut(out, rows * cols) };

    rustkit_core::matrix::sub_f32(a_slice, b_slice, out_slice, rows, cols);
}

#[unsafe(no_mangle)]
pub unsafe extern "C" fn rk_matrix_trace_f32(
    a: *const f32,
    n: usize,
) -> f32 {
    if a.is_null() {
        return 0.0;
    }

    let a_slice = unsafe { std::slice::from_raw_parts(a, n * n) };

    rustkit_core::matrix::trace_f32(a_slice, n)
}

#[unsafe(no_mangle)]
pub unsafe extern "C" fn rk_matrix_eye_f32(
    out: *mut f32,
    n: usize,
) {
    if out.is_null() {
        return;
    }

    let out_slice = unsafe { std::slice::from_raw_parts_mut(out, n * n) };

    rustkit_core::matrix::eye_f32(out_slice, n);
}

#[unsafe(no_mangle)]
pub unsafe extern "C" fn rk_matrix_reshape(
    a: *const f32,
    out: *mut f32,
    rows: usize,
    cols: usize,
) {
    if a.is_null() || out.is_null() {
        return;
    }

    let a_slice = unsafe { std::slice::from_raw_parts(a, rows * cols) };
    let out_slice = unsafe { std::slice::from_raw_parts_mut(out, rows * cols) };

    rustkit_core::matrix::reshape(a_slice, out_slice, rows, cols);
}
