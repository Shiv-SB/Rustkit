#[unsafe(no_mangle)]
pub unsafe extern "C" fn rk_stats_mean_f32(
    a: *const f32,
    len: usize,
) -> f32 {
    if a.is_null() || len == 0 {
        return 0.0;
    }

    let a_slice = unsafe { std::slice::from_raw_parts(a, len) };

    rustkit_core::stats::mean_f32(a_slice)
}

#[unsafe(no_mangle)]
pub unsafe extern "C" fn rk_stats_median_f32(
    a: *const f32,
    len: usize,
) -> f32 {
    if a.is_null() || len == 0 {
        return 0.0;
    }

    let a_slice = unsafe { std::slice::from_raw_parts(a, len) };

    rustkit_core::stats::median_f32(a_slice)
}

#[unsafe(no_mangle)]
pub unsafe extern "C" fn rk_stats_variance_f32(
    a: *const f32,
    len: usize,
) -> f32 {
    if a.is_null() || len == 0 {
        return 0.0;
    }

    let a_slice = unsafe { std::slice::from_raw_parts(a, len) };

    rustkit_core::stats::variance_f32(a_slice)
}

#[unsafe(no_mangle)]
pub unsafe extern "C" fn rk_stats_stddev_f32(
    a: *const f32,
    len: usize,
) -> f32 {
    if a.is_null() || len == 0 {
        return 0.0;
    }

    let a_slice = unsafe { std::slice::from_raw_parts(a, len) };

    rustkit_core::stats::stddev_f32(a_slice)
}

#[unsafe(no_mangle)]
pub unsafe extern "C" fn rk_stats_percentile_f32(
    a: *const f32,
    len: usize,
    p: f32,
) -> f32 {
    if a.is_null() || len == 0 {
        return 0.0;
    }

    let a_slice = unsafe { std::slice::from_raw_parts(a, len) };

    rustkit_core::stats::percentile_f32(a_slice, p)
}

#[unsafe(no_mangle)]
pub unsafe extern "C" fn rk_stats_covariance_f32(
    a: *const f32,
    b: *const f32,
    len: usize,
) -> f32 {
    if a.is_null() || b.is_null() || len == 0 {
        return 0.0;
    }

    let a_slice = unsafe { std::slice::from_raw_parts(a, len) };
    let b_slice = unsafe { std::slice::from_raw_parts(b, len) };

    rustkit_core::stats::covariance_f32(a_slice, b_slice)
}

#[unsafe(no_mangle)]
pub unsafe extern "C" fn rk_stats_correlation_f32(
    a: *const f32,
    b: *const f32,
    len: usize,
) -> f32 {
    if a.is_null() || b.is_null() || len == 0 {
        return 0.0;
    }

    let a_slice = unsafe { std::slice::from_raw_parts(a, len) };
    let b_slice = unsafe { std::slice::from_raw_parts(b, len) };

    rustkit_core::stats::correlation_f32(a_slice, b_slice)
}

#[unsafe(no_mangle)]
pub unsafe extern "C" fn rk_stats_zscore_f32(
    a: *mut f32,
    len: usize,
) {
    if a.is_null() || len == 0 {
        return;
    }

    let a_slice = unsafe { std::slice::from_raw_parts_mut(a, len) };

    rustkit_core::stats::zscore_f32(a_slice);
}

#[unsafe(no_mangle)]
pub unsafe extern "C" fn rk_stats_histogram_f32(
    a: *const f32,
    len: usize,
    bins: usize,
    out: *mut u32,
) {
    if a.is_null() || out.is_null() || len == 0 || bins == 0 {
        return;
    }

    let a_slice = unsafe { std::slice::from_raw_parts(a, len) };
    let out_slice = unsafe { std::slice::from_raw_parts_mut(out, bins) };

    rustkit_core::stats::histogram_f32(a_slice, bins, out_slice);
}

#[unsafe(no_mangle)]
pub unsafe extern "C" fn rk_stats_quantile_f32(
    a: *const f32,
    len: usize,
    q: f32,
) -> f32 {
    if a.is_null() || len == 0 {
        return 0.0;
    }

    let a_slice = unsafe { std::slice::from_raw_parts(a, len) };

    rustkit_core::stats::quantile_f32(a_slice, q)
}
