#[unsafe(no_mangle)]
pub unsafe extern "C" fn rk_sampling_softmax_f32(
    a: *mut f32,
    len: usize,
) {
    if a.is_null() {
        return;
    }

    let a_slice = unsafe { std::slice::from_raw_parts_mut(a, len) };

    rustkit_core::sampling::softmax_f32(a_slice);
}

#[unsafe(no_mangle)]
pub unsafe extern "C" fn rk_sampling_log_softmax_f32(
    a: *mut f32,
    len: usize,
) {
    if a.is_null() {
        return;
    }

    let a_slice = unsafe { std::slice::from_raw_parts_mut(a, len) };

    rustkit_core::sampling::log_softmax_f32(a_slice);
}

#[unsafe(no_mangle)]
pub unsafe extern "C" fn rk_sampling_temperature_f32(
    a: *mut f32,
    temperature: f32,
    len: usize,
) {
    if a.is_null() {
        return;
    }

    let a_slice = unsafe { std::slice::from_raw_parts_mut(a, len) };

    rustkit_core::sampling::temperature_f32(a_slice, temperature);
}

#[unsafe(no_mangle)]
pub unsafe extern "C" fn rk_sampling_top_k_f32(
    a: *mut f32,
    k: usize,
    len: usize,
) {
    if a.is_null() {
        return;
    }

    let a_slice = unsafe { std::slice::from_raw_parts_mut(a, len) };

    rustkit_core::sampling::top_k_f32(a_slice, k);
}

#[unsafe(no_mangle)]
pub unsafe extern "C" fn rk_sampling_top_p_f32(
    a: *mut f32,
    p: f32,
    len: usize,
) {
    if a.is_null() {
        return;
    }

    let a_slice = unsafe { std::slice::from_raw_parts_mut(a, len) };

    rustkit_core::sampling::top_p_f32(a_slice, p);
}

#[unsafe(no_mangle)]
pub unsafe extern "C" fn rk_sampling_min_p_f32(
    a: *mut f32,
    p: f32,
    len: usize,
) {
    if a.is_null() {
        return;
    }

    let a_slice = unsafe { std::slice::from_raw_parts_mut(a, len) };

    rustkit_core::sampling::min_p_f32(a_slice, p);
}

#[unsafe(no_mangle)]
pub unsafe extern "C" fn rk_sampling_repetition_penalty_f32(
    a: *mut f32,
    len: usize,
    penalty: f32,
    seen: *const u32,
    seen_len: usize,
) {
    if a.is_null() || seen.is_null() {
        return;
    }

    let a_slice = unsafe { std::slice::from_raw_parts_mut(a, len) };
    let seen_slice = unsafe { std::slice::from_raw_parts(seen, seen_len) };

    rustkit_core::sampling::repetition_penalty_f32(a_slice, penalty, seen_slice);
}

#[unsafe(no_mangle)]
pub unsafe extern "C" fn rk_sampling_categorical_f32(
    probs: *const f32,
    len: usize,
    seed: u64,
) -> u64 {
    if probs.is_null() || len == 0 {
        return 0;
    }

    let probs_slice = unsafe { std::slice::from_raw_parts(probs, len) };

    rustkit_core::sampling::categorical_f32(probs_slice, seed) as u64
}

#[unsafe(no_mangle)]
pub unsafe extern "C" fn rk_sampling_greedy_f32(
    a: *const f32,
    len: usize,
) -> u64 {
    if a.is_null() || len == 0 {
        return 0;
    }

    let a_slice = unsafe { std::slice::from_raw_parts(a, len) };

    rustkit_core::sampling::greedy_f32(a_slice) as u64
}