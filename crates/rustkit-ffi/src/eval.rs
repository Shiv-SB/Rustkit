#[unsafe(no_mangle)]
pub unsafe extern "C" fn rk_eval_perplexity_f32(
    a: *const f32,
    len: usize,
) -> f32 {
    if a.is_null() || len == 0 {
        return 0.0;
    }

    let a_slice = unsafe { std::slice::from_raw_parts(a, len) };

    rustkit_core::eval::perplexity_f32(a_slice)
}

#[unsafe(no_mangle)]
pub unsafe extern "C" fn rk_eval_bleu(
    reference: *const u8,
    reference_len: usize,
    hypothesis: *const u8,
    hypothesis_len: usize,
    max_n: usize,
) -> f32 {
    if reference.is_null() || hypothesis.is_null() {
        return 0.0;
    }

    let reference_slice = unsafe { std::slice::from_raw_parts(reference, reference_len) };
    let hypothesis_slice = unsafe { std::slice::from_raw_parts(hypothesis, hypothesis_len) };

    rustkit_core::eval::bleu(reference_slice, hypothesis_slice, max_n)
}

#[unsafe(no_mangle)]
pub unsafe extern "C" fn rk_eval_rouge_l(
    reference: *const u8,
    reference_len: usize,
    hypothesis: *const u8,
    hypothesis_len: usize,
) -> f32 {
    if reference.is_null() || hypothesis.is_null() {
        return 0.0;
    }

    let reference_slice = unsafe { std::slice::from_raw_parts(reference, reference_len) };
    let hypothesis_slice = unsafe { std::slice::from_raw_parts(hypothesis, hypothesis_len) };

    rustkit_core::eval::rouge_l(reference_slice, hypothesis_slice)
}

#[unsafe(no_mangle)]
pub unsafe extern "C" fn rk_eval_token_f1_i32(
    reference: *const i32,
    reference_len: usize,
    hypothesis: *const i32,
    hypothesis_len: usize,
) -> f32 {
    if reference.is_null() || hypothesis.is_null() {
        return 0.0;
    }

    let reference_slice = unsafe { std::slice::from_raw_parts(reference, reference_len) };
    let hypothesis_slice = unsafe { std::slice::from_raw_parts(hypothesis, hypothesis_len) };

    rustkit_core::eval::token_f1_i32(reference_slice, hypothesis_slice)
}

#[unsafe(no_mangle)]
pub unsafe extern "C" fn rk_eval_exact_match(
    reference: *const u8,
    reference_len: usize,
    hypothesis: *const u8,
    hypothesis_len: usize,
) -> bool {
    if reference.is_null() || hypothesis.is_null() {
        return false;
    }

    let reference_slice = unsafe { std::slice::from_raw_parts(reference, reference_len) };
    let hypothesis_slice = unsafe { std::slice::from_raw_parts(hypothesis, hypothesis_len) };

    rustkit_core::eval::exact_match(reference_slice, hypothesis_slice)
}