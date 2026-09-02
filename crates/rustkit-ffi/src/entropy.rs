#[unsafe(no_mangle)]
pub unsafe extern "C" fn rk_entropy_shannon_entropy_f32(
    a: *const f32,
    len: usize,
) -> f32 {
    if a.is_null() {
        return 0.0;
    }

    let a_slice = unsafe { std::slice::from_raw_parts(a, len) };

    rustkit_core::entropy::shannon_entropy_f32(a_slice)
}

#[unsafe(no_mangle)]
pub unsafe extern "C" fn rk_entropy_cross_entropy_f32(
    a: *const f32,
    b: *const f32,
    len: usize,
) -> f32 {
    if a.is_null() || b.is_null() {
        return 0.0;
    }

    let a_slice = unsafe { std::slice::from_raw_parts(a, len) };
    let b_slice = unsafe { std::slice::from_raw_parts(b, len) };

    rustkit_core::entropy::cross_entropy_f32(a_slice, b_slice)
}

#[unsafe(no_mangle)]
pub unsafe extern "C" fn rk_entropy_kl_divergence_f32(
    a: *const f32,
    b: *const f32,
    len: usize,
) -> f32 {
    if a.is_null() || b.is_null() {
        return 0.0;
    }

    let a_slice = unsafe { std::slice::from_raw_parts(a, len) };
    let b_slice = unsafe { std::slice::from_raw_parts(b, len) };

    rustkit_core::entropy::kl_divergence_f32(a_slice, b_slice)
}

#[unsafe(no_mangle)]
pub unsafe extern "C" fn rk_entropy_mutual_information_f32(
    joint: *const f32,
    marginal_x: *const f32,
    marginal_y: *const f32,
    rows: usize,
    cols: usize,
) -> f32 {
    if joint.is_null() || marginal_x.is_null() || marginal_y.is_null() {
        return 0.0;
    }

    let joint_slice = unsafe { std::slice::from_raw_parts(joint, rows * cols) };
    let marginal_x_slice = unsafe { std::slice::from_raw_parts(marginal_x, rows) };
    let marginal_y_slice = unsafe { std::slice::from_raw_parts(marginal_y, cols) };

    rustkit_core::entropy::mutual_information_f32(joint_slice, marginal_x_slice, marginal_y_slice, rows, cols)
}
