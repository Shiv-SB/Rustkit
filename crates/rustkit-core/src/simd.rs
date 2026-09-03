//! Explicit SIMD reduction kernels.
//!
//! - AArch64: NEON intrinsics.
//! - x86_64: AVX2 or SSE2 intrinsics, selected at **runtime** via
//!   `is_x86_feature_detected!` — never `target-cpu=native`, so cross-built
//!   x86 binaries still run on old CPUs.
//! - Other targets: scalar loops that LLVM auto-vectorizes in release builds.

pub fn dot_f32(a: &[f32], b: &[f32]) -> f32 {
    assert_eq!(a.len(), b.len());
    #[cfg(target_arch = "aarch64")]
    {
        unsafe { dot_f32_neon(a, b) }
    }
    #[cfg(target_arch = "x86_64")]
    {
        if std::arch::is_x86_feature_detected!("avx2") {
            unsafe { dot_f32_avx2(a, b) }
        } else if std::arch::is_x86_feature_detected!("sse2") {
            unsafe { dot_f32_sse2(a, b) }
        } else {
            dot_f32_scalar(a, b)
        }
    }
    #[cfg(not(any(target_arch = "aarch64", target_arch = "x86_64")))]
    {
        dot_f32_scalar(a, b)
    }
}

pub fn sum_f32(a: &[f32]) -> f32 {
    #[cfg(target_arch = "aarch64")]
    {
        unsafe { sum_f32_neon(a) }
    }
    #[cfg(target_arch = "x86_64")]
    {
        if std::arch::is_x86_feature_detected!("avx2") {
            unsafe { sum_f32_avx2(a) }
        } else if std::arch::is_x86_feature_detected!("sse2") {
            unsafe { sum_f32_sse2(a) }
        } else {
            sum_f32_scalar(a)
        }
    }
    #[cfg(not(any(target_arch = "aarch64", target_arch = "x86_64")))]
    {
        sum_f32_scalar(a)
    }
}

pub fn l1_f32(a: &[f32]) -> f32 {
    #[cfg(target_arch = "aarch64")]
    {
        unsafe { l1_f32_neon(a) }
    }
    #[cfg(target_arch = "x86_64")]
    {
        if std::arch::is_x86_feature_detected!("avx2") {
            unsafe { l1_f32_avx2(a) }
        } else if std::arch::is_x86_feature_detected!("sse2") {
            unsafe { l1_f32_sse2(a) }
        } else {
            l1_f32_scalar(a)
        }
    }
    #[cfg(not(any(target_arch = "aarch64", target_arch = "x86_64")))]
    {
        l1_f32_scalar(a)
    }
}

pub fn squared_diff_sum_f32(a: &[f32], b: &[f32]) -> f32 {
    assert_eq!(a.len(), b.len());
    #[cfg(target_arch = "aarch64")]
    {
        unsafe { squared_diff_sum_f32_neon(a, b) }
    }
    #[cfg(target_arch = "x86_64")]
    {
        if std::arch::is_x86_feature_detected!("avx2") {
            unsafe { squared_diff_sum_f32_avx2(a, b) }
        } else if std::arch::is_x86_feature_detected!("sse2") {
            unsafe { squared_diff_sum_f32_sse2(a, b) }
        } else {
            squared_diff_sum_f32_scalar(a, b)
        }
    }
    #[cfg(not(any(target_arch = "aarch64", target_arch = "x86_64")))]
    {
        squared_diff_sum_f32_scalar(a, b)
    }
}

pub fn max_abs_f32(a: &[f32]) -> f32 {
    #[cfg(target_arch = "aarch64")]
    {
        unsafe { max_abs_f32_neon(a) }
    }
    #[cfg(target_arch = "x86_64")]
    {
        if std::arch::is_x86_feature_detected!("avx2") {
            unsafe { max_abs_f32_avx2(a) }
        } else if std::arch::is_x86_feature_detected!("sse2") {
            unsafe { max_abs_f32_sse2(a) }
        } else {
            max_abs_f32_scalar(a)
        }
    }
    #[cfg(not(any(target_arch = "aarch64", target_arch = "x86_64")))]
    {
        max_abs_f32_scalar(a)
    }
}

pub fn max_f32(a: &[f32]) -> f32 {
    #[cfg(target_arch = "aarch64")]
    {
        unsafe { max_f32_neon(a) }
    }
    #[cfg(target_arch = "x86_64")]
    {
        if std::arch::is_x86_feature_detected!("avx2") {
            unsafe { max_f32_avx2(a) }
        } else if std::arch::is_x86_feature_detected!("sse2") {
            unsafe { max_f32_sse2(a) }
        } else {
            max_f32_scalar(a)
        }
    }
    #[cfg(not(any(target_arch = "aarch64", target_arch = "x86_64")))]
    {
        max_f32_scalar(a)
    }
}

// ---------------------------------------------------------------------------
// AArch64 NEON kernels
// ---------------------------------------------------------------------------

#[cfg(target_arch = "aarch64")]
#[target_feature(enable = "neon")]
fn dot_f32_neon(a: &[f32], b: &[f32]) -> f32 {
    use std::arch::aarch64::*;
    let n = a.len();
    let mut i = 0;
    let mut acc = vdupq_n_f32(0.0);
    while i + 8 <= n {
        let pa = unsafe { a.as_ptr().add(i) };
        let pb = unsafe { b.as_ptr().add(i) };
        acc = vfmaq_f32(acc, unsafe { vld1q_f32(pa) }, unsafe { vld1q_f32(pb) });
        let pa = unsafe { a.as_ptr().add(i + 4) };
        let pb = unsafe { b.as_ptr().add(i + 4) };
        acc = vfmaq_f32(acc, unsafe { vld1q_f32(pa) }, unsafe { vld1q_f32(pb) });
        i += 8;
    }
    let mut sum = vaddvq_f32(acc);
    while i < n {
        sum += a[i] * b[i];
        i += 1;
    }
    sum
}

#[cfg(target_arch = "aarch64")]
#[target_feature(enable = "neon")]
unsafe fn sum_f32_neon(a: &[f32]) -> f32 {
    use std::arch::aarch64::*;
    let n = a.len();
    let mut i = 0;
    let mut acc = vdupq_n_f32(0.0);
    while i + 8 <= n {
        acc = vaddq_f32(acc, unsafe { vld1q_f32(a.as_ptr().add(i)) });
        acc = vaddq_f32(acc, unsafe { vld1q_f32(a.as_ptr().add(i + 4)) });
        i += 8;
    }
    let mut sum = vaddvq_f32(acc);
    while i < n {
        sum += a[i];
        i += 1;
    }
    sum
}

#[cfg(target_arch = "aarch64")]
#[target_feature(enable = "neon")]
unsafe fn l1_f32_neon(a: &[f32]) -> f32 {
    use std::arch::aarch64::*;
    let n = a.len();
    let mut i = 0;
    let mut acc = vdupq_n_f32(0.0);
    while i + 8 <= n {
        acc = vaddq_f32(acc, vabsq_f32(unsafe { vld1q_f32(a.as_ptr().add(i)) }));
        acc = vaddq_f32(acc, vabsq_f32(unsafe { vld1q_f32(a.as_ptr().add(i + 4)) }));
        i += 8;
    }
    let mut sum = vaddvq_f32(acc);
    while i < n {
        sum += a[i].abs();
        i += 1;
    }
    sum
}

#[cfg(target_arch = "aarch64")]
#[target_feature(enable = "neon")]
unsafe fn squared_diff_sum_f32_neon(a: &[f32], b: &[f32]) -> f32 {
    use std::arch::aarch64::*;
    let n = a.len();
    let mut i = 0;
    let mut acc = vdupq_n_f32(0.0);
    while i + 8 <= n {
        let pa0 = unsafe { a.as_ptr().add(i) };
        let pb0 = unsafe { b.as_ptr().add(i) };
        let pa1 = unsafe { a.as_ptr().add(i + 4) };
        let pb1 = unsafe { b.as_ptr().add(i + 4) };
        let d0 = vsubq_f32(unsafe { vld1q_f32(pa0) }, unsafe { vld1q_f32(pb0) });
        let d1 = vsubq_f32(unsafe { vld1q_f32(pa1) }, unsafe { vld1q_f32(pb1) });
        acc = vfmaq_f32(acc, d0, d0);
        acc = vfmaq_f32(acc, d1, d1);
        i += 8;
    }
    let mut sum = vaddvq_f32(acc);
    while i < n {
        let d = a[i] - b[i];
        sum += d * d;
        i += 1;
    }
    sum
}

#[cfg(target_arch = "aarch64")]
#[target_feature(enable = "neon")]
unsafe fn max_abs_f32_neon(a: &[f32]) -> f32 {
    use std::arch::aarch64::*;
    let n = a.len();
    let mut i = 0;
    let mut acc = vdupq_n_f32(0.0);
    while i + 4 <= n {
        acc = vmaxq_f32(acc, vabsq_f32(unsafe { vld1q_f32(a.as_ptr().add(i)) }));
        i += 4;
    }
    let mut m = vmaxvq_f32(acc);
    while i < n {
        m = m.max(a[i].abs());
        i += 1;
    }
    m
}

#[cfg(target_arch = "aarch64")]
#[target_feature(enable = "neon")]
unsafe fn max_f32_neon(a: &[f32]) -> f32 {
    use std::arch::aarch64::*;
    let n = a.len();
    let mut i = 0;
    let mut acc = vdupq_n_f32(f32::NEG_INFINITY);
    while i + 4 <= n {
        acc = vmaxq_f32(acc, unsafe { vld1q_f32(a.as_ptr().add(i)) });
        i += 4;
    }
    let mut m = vmaxvq_f32(acc);
    while i < n {
        m = m.max(a[i]);
        i += 1;
    }
    m
}

// ---------------------------------------------------------------------------
// x86_64 horizontal-reduction helpers.
//
// The 128-bit ones only need SSE2, so both the SSE2 and AVX2 kernels can
// call them (enabling `avx2` implies `sse2`).
// ---------------------------------------------------------------------------

#[cfg(target_arch = "x86_64")]
#[target_feature(enable = "sse2")]
unsafe fn hsum128_sse2(v: std::arch::x86_64::__m128) -> f32 {
    use std::arch::x86_64::*;
    // 0xB1 == _MM_SHUFFLE(2, 3, 0, 1) (unstable as a const fn), i.e. [v1, v0, v3, v2]
    let shuf = _mm_shuffle_ps(v, v, 0xB1);
    let sums = _mm_add_ps(v, shuf); // lane0 = v0+v1, lane2 = v2+v3
    let hl = _mm_movehl_ps(sums, sums); // lane0 = v2+v3
    _mm_cvtss_f32(_mm_add_ss(sums, hl))
}

#[cfg(target_arch = "x86_64")]
#[target_feature(enable = "sse2")]
unsafe fn hmax128_sse2(v: std::arch::x86_64::__m128) -> f32 {
    use std::arch::x86_64::*;
    // 0xB1 == _MM_SHUFFLE(2, 3, 0, 1) (unstable as a const fn), i.e. [v1, v0, v3, v2]
    let shuf = _mm_shuffle_ps(v, v, 0xB1);
    let m1 = _mm_max_ps(v, shuf); // lane0 = max(v0,v1), lane2 = max(v2,v3)
    let m2 = _mm_movehl_ps(m1, m1); // lane0 = max(v2,v3)
    _mm_cvtss_f32(_mm_max_ps(m1, m2))
}

#[cfg(target_arch = "x86_64")]
#[target_feature(enable = "avx2")]
unsafe fn hsum256_avx2(v: std::arch::x86_64::__m256) -> f32 {
    use std::arch::x86_64::*;
    let lo = _mm256_castps256_ps128(v);
    let hi = _mm256_extractf128_ps(v, 1);
    unsafe { hsum128_sse2(_mm_add_ps(lo, hi)) }
}

#[cfg(target_arch = "x86_64")]
#[target_feature(enable = "avx2")]
unsafe fn hmax256_avx2(v: std::arch::x86_64::__m256) -> f32 {
    use std::arch::x86_64::*;
    let lo = _mm256_castps256_ps128(v);
    let hi = _mm256_extractf128_ps(v, 1);
    unsafe { hmax128_sse2(_mm_max_ps(lo, hi)) }
}

// ---------------------------------------------------------------------------
// x86_64 AVX2 kernels — 2x unrolled 8-lane loads (16 elements per iteration),
// scalar tail for remainders. No FMA: the dispatch only guarantees AVX2, and
// the `fma` CPUID bit is independent of `avx2`.
// ---------------------------------------------------------------------------

#[cfg(target_arch = "x86_64")]
#[target_feature(enable = "avx2")]
unsafe fn dot_f32_avx2(a: &[f32], b: &[f32]) -> f32 {
    use std::arch::x86_64::*;
    let n = a.len();
    let mut i = 0;
    let mut acc = _mm256_setzero_ps();
    while i + 16 <= n {
        let va = unsafe { _mm256_loadu_ps(a.as_ptr().add(i)) };
        let vb = unsafe { _mm256_loadu_ps(b.as_ptr().add(i)) };
        acc = _mm256_add_ps(acc, _mm256_mul_ps(va, vb));
        let va = unsafe { _mm256_loadu_ps(a.as_ptr().add(i + 8)) };
        let vb = unsafe { _mm256_loadu_ps(b.as_ptr().add(i + 8)) };
        acc = _mm256_add_ps(acc, _mm256_mul_ps(va, vb));
        i += 16;
    }
    let mut sum = unsafe { hsum256_avx2(acc) };
    while i < n {
        sum += a[i] * b[i];
        i += 1;
    }
    sum
}

#[cfg(target_arch = "x86_64")]
#[target_feature(enable = "avx2")]
unsafe fn sum_f32_avx2(a: &[f32]) -> f32 {
    use std::arch::x86_64::*;
    let n = a.len();
    let mut i = 0;
    let mut acc = _mm256_setzero_ps();
    while i + 16 <= n {
        acc = _mm256_add_ps(acc, unsafe { _mm256_loadu_ps(a.as_ptr().add(i)) });
        acc = _mm256_add_ps(acc, unsafe { _mm256_loadu_ps(a.as_ptr().add(i + 8)) });
        i += 16;
    }
    let mut sum = unsafe { hsum256_avx2(acc) };
    while i < n {
        sum += a[i];
        i += 1;
    }
    sum
}

#[cfg(target_arch = "x86_64")]
#[target_feature(enable = "avx2")]
unsafe fn l1_f32_avx2(a: &[f32]) -> f32 {
    use std::arch::x86_64::*;
    let n = a.len();
    let mut i = 0;
    let sign = _mm256_set1_ps(-0.0); // 0x80000000 broadcast: andnot clears the sign bit
    let mut acc = _mm256_setzero_ps();
    while i + 16 <= n {
        acc = _mm256_add_ps(acc, _mm256_andnot_ps(sign, unsafe { _mm256_loadu_ps(a.as_ptr().add(i)) }));
        acc = _mm256_add_ps(acc, _mm256_andnot_ps(sign, unsafe { _mm256_loadu_ps(a.as_ptr().add(i + 8)) }));
        i += 16;
    }
    let mut sum = unsafe { hsum256_avx2(acc) };
    while i < n {
        sum += a[i].abs();
        i += 1;
    }
    sum
}

#[cfg(target_arch = "x86_64")]
#[target_feature(enable = "avx2")]
unsafe fn squared_diff_sum_f32_avx2(a: &[f32], b: &[f32]) -> f32 {
    use std::arch::x86_64::*;
    let n = a.len();
    let mut i = 0;
    let mut acc = _mm256_setzero_ps();
    while i + 16 <= n {
        let d0 = _mm256_sub_ps(
            unsafe { _mm256_loadu_ps(a.as_ptr().add(i)) },
            unsafe { _mm256_loadu_ps(b.as_ptr().add(i)) },
        );
        acc = _mm256_add_ps(acc, _mm256_mul_ps(d0, d0));
        let d1 = _mm256_sub_ps(
            unsafe { _mm256_loadu_ps(a.as_ptr().add(i + 8)) },
            unsafe { _mm256_loadu_ps(b.as_ptr().add(i + 8)) },
        );
        acc = _mm256_add_ps(acc, _mm256_mul_ps(d1, d1));
        i += 16;
    }
    let mut sum = unsafe { hsum256_avx2(acc) };
    while i < n {
        let d = a[i] - b[i];
        sum += d * d;
        i += 1;
    }
    sum
}

#[cfg(target_arch = "x86_64")]
#[target_feature(enable = "avx2")]
unsafe fn max_abs_f32_avx2(a: &[f32]) -> f32 {
    use std::arch::x86_64::*;
    let n = a.len();
    let mut i = 0;
    let sign = _mm256_set1_ps(-0.0);
    let mut acc = _mm256_setzero_ps();
    while i + 8 <= n {
        acc = _mm256_max_ps(acc, _mm256_andnot_ps(sign, unsafe { _mm256_loadu_ps(a.as_ptr().add(i)) }));
        i += 8;
    }
    let mut m = unsafe { hmax256_avx2(acc) };
    while i < n {
        m = m.max(a[i].abs());
        i += 1;
    }
    m
}

#[cfg(target_arch = "x86_64")]
#[target_feature(enable = "avx2")]
unsafe fn max_f32_avx2(a: &[f32]) -> f32 {
    use std::arch::x86_64::*;
    let n = a.len();
    let mut i = 0;
    let mut acc = _mm256_set1_ps(f32::NEG_INFINITY);
    while i + 8 <= n {
        acc = _mm256_max_ps(acc, unsafe { _mm256_loadu_ps(a.as_ptr().add(i)) });
        i += 8;
    }
    let mut m = unsafe { hmax256_avx2(acc) };
    while i < n {
        m = m.max(a[i]);
        i += 1;
    }
    m
}

// ---------------------------------------------------------------------------
// x86_64 SSE2 kernels — 2x unrolled 4-lane loads (8 elements per iteration),
// scalar tail for remainders. SSE2 is the x86_64 baseline, so these run on
// every x86_64 CPU; they are the fallback when AVX2 is not detected.
// ---------------------------------------------------------------------------

#[cfg(target_arch = "x86_64")]
#[target_feature(enable = "sse2")]
unsafe fn dot_f32_sse2(a: &[f32], b: &[f32]) -> f32 {
    use std::arch::x86_64::*;
    let n = a.len();
    let mut i = 0;
    let mut acc = _mm_setzero_ps();
    while i + 8 <= n {
        let va = unsafe { _mm_loadu_ps(a.as_ptr().add(i)) };
        let vb = unsafe { _mm_loadu_ps(b.as_ptr().add(i)) };
        acc = _mm_add_ps(acc, _mm_mul_ps(va, vb));
        let va = unsafe { _mm_loadu_ps(a.as_ptr().add(i + 4)) };
        let vb = unsafe { _mm_loadu_ps(b.as_ptr().add(i + 4)) };
        acc = _mm_add_ps(acc, _mm_mul_ps(va, vb));
        i += 8;
    }
    let mut sum = unsafe { hsum128_sse2(acc) };
    while i < n {
        sum += a[i] * b[i];
        i += 1;
    }
    sum
}

#[cfg(target_arch = "x86_64")]
#[target_feature(enable = "sse2")]
unsafe fn sum_f32_sse2(a: &[f32]) -> f32 {
    use std::arch::x86_64::*;
    let n = a.len();
    let mut i = 0;
    let mut acc = _mm_setzero_ps();
    while i + 8 <= n {
        acc = _mm_add_ps(acc, unsafe { _mm_loadu_ps(a.as_ptr().add(i)) });
        acc = _mm_add_ps(acc, unsafe { _mm_loadu_ps(a.as_ptr().add(i + 4)) });
        i += 8;
    }
    let mut sum = unsafe { hsum128_sse2(acc) };
    while i < n {
        sum += a[i];
        i += 1;
    }
    sum
}

#[cfg(target_arch = "x86_64")]
#[target_feature(enable = "sse2")]
unsafe fn l1_f32_sse2(a: &[f32]) -> f32 {
    use std::arch::x86_64::*;
    let n = a.len();
    let mut i = 0;
    let sign = _mm_set1_ps(-0.0);
    let mut acc = _mm_setzero_ps();
    while i + 8 <= n {
        acc = _mm_add_ps(acc, _mm_andnot_ps(sign, unsafe { _mm_loadu_ps(a.as_ptr().add(i)) }));
        acc = _mm_add_ps(acc, _mm_andnot_ps(sign, unsafe { _mm_loadu_ps(a.as_ptr().add(i + 4)) }));
        i += 8;
    }
    let mut sum = unsafe { hsum128_sse2(acc) };
    while i < n {
        sum += a[i].abs();
        i += 1;
    }
    sum
}

#[cfg(target_arch = "x86_64")]
#[target_feature(enable = "sse2")]
unsafe fn squared_diff_sum_f32_sse2(a: &[f32], b: &[f32]) -> f32 {
    use std::arch::x86_64::*;
    let n = a.len();
    let mut i = 0;
    let mut acc = _mm_setzero_ps();
    while i + 8 <= n {
        let d0 = _mm_sub_ps(
            unsafe { _mm_loadu_ps(a.as_ptr().add(i)) },
            unsafe { _mm_loadu_ps(b.as_ptr().add(i)) },
        );
        acc = _mm_add_ps(acc, _mm_mul_ps(d0, d0));
        let d1 = _mm_sub_ps(
            unsafe { _mm_loadu_ps(a.as_ptr().add(i + 4)) },
            unsafe { _mm_loadu_ps(b.as_ptr().add(i + 4)) },
        );
        acc = _mm_add_ps(acc, _mm_mul_ps(d1, d1));
        i += 8;
    }
    let mut sum = unsafe { hsum128_sse2(acc) };
    while i < n {
        let d = a[i] - b[i];
        sum += d * d;
        i += 1;
    }
    sum
}

#[cfg(target_arch = "x86_64")]
#[target_feature(enable = "sse2")]
unsafe fn max_abs_f32_sse2(a: &[f32]) -> f32 {
    use std::arch::x86_64::*;
    let n = a.len();
    let mut i = 0;
    let sign = _mm_set1_ps(-0.0);
    let mut acc = _mm_setzero_ps();
    while i + 4 <= n {
        acc = _mm_max_ps(acc, _mm_andnot_ps(sign, unsafe { _mm_loadu_ps(a.as_ptr().add(i)) }));
        i += 4;
    }
    let mut m = unsafe { hmax128_sse2(acc) };
    while i < n {
        m = m.max(a[i].abs());
        i += 1;
    }
    m
}

#[cfg(target_arch = "x86_64")]
#[target_feature(enable = "sse2")]
unsafe fn max_f32_sse2(a: &[f32]) -> f32 {
    use std::arch::x86_64::*;
    let n = a.len();
    let mut i = 0;
    let mut acc = _mm_set1_ps(f32::NEG_INFINITY);
    while i + 4 <= n {
        acc = _mm_max_ps(acc, unsafe { _mm_loadu_ps(a.as_ptr().add(i)) });
        i += 4;
    }
    let mut m = unsafe { hmax128_sse2(acc) };
    while i < n {
        m = m.max(a[i]);
        i += 1;
    }
    m
}

// ---------------------------------------------------------------------------
// Scalar reference. Compiled on every target: it is the fallback for
// non-NEON/non-x86_64 targets and for x86_64 CPUs without SSE2, and the
// reference implementation the unit tests compare against.
// ---------------------------------------------------------------------------

#[allow(dead_code)]
fn dot_f32_scalar(a: &[f32], b: &[f32]) -> f32 {
    a.iter().zip(b).map(|(&x, &y)| x * y).sum()
}

#[allow(dead_code)]
fn sum_f32_scalar(a: &[f32]) -> f32 {
    a.iter().sum()
}

#[allow(dead_code)]
fn l1_f32_scalar(a: &[f32]) -> f32 {
    a.iter().map(|x| x.abs()).sum()
}

#[allow(dead_code)]
fn squared_diff_sum_f32_scalar(a: &[f32], b: &[f32]) -> f32 {
    a.iter().zip(b).map(|(&x, &y)| (x - y) * (x - y)).sum()
}

#[allow(dead_code)]
fn max_abs_f32_scalar(a: &[f32]) -> f32 {
    a.iter().map(|x| x.abs()).fold(0.0, f32::max)
}

#[allow(dead_code)]
fn max_f32_scalar(a: &[f32]) -> f32 {
    a.iter().copied().fold(f32::NEG_INFINITY, f32::max)
}

#[cfg(test)]
mod tests {
    use super::*;

    /// Deterministic LCG (Numerical Recipes constants) so any failure is
    /// reproducible across machines and runs.
    struct Lcg(u32);

    impl Lcg {
        /// Uniform-ish f32 in [-100, 100), exactly representable mantissa.
        fn next_f32(&mut self) -> f32 {
            self.0 = self.0.wrapping_mul(1_664_525).wrapping_add(1_013_904_223);
            ((self.0 >> 8) as f32 / 16_777_216.0) * 200.0 - 100.0
        }

        fn vec(&mut self, n: usize) -> Vec<f32> {
            (0..n).map(|_| self.next_f32()).collect()
        }
    }

    /// SIMD and scalar accumulate in different orders, so allow a small
    /// relative slack; max_abs is exact (no rounding), so it uses ==.
    fn close(a: f32, b: f32) -> bool {
        (a - b).abs() <= 1e-3 * b.abs().max(1.0)
    }

    /// Lengths chosen to exercise the unrolled bodies and the scalar tails
    /// of every backend: AVX2 steps 16, SSE2 steps 8, NEON steps 8/4.
    const LENGTHS: [usize; 15] = [0, 1, 3, 4, 7, 8, 10, 15, 16, 17, 31, 32, 33, 100, 1000];

    #[test]
    fn reductions_match_scalar_reference() {
        for &n in &LENGTHS {
            let a = Lcg(0x2545_F491).vec(n);
            let b = Lcg(0x9E37_79B9).vec(n);

            assert!(
                close(dot_f32(&a, &b), dot_f32_scalar(&a, &b)),
                "dot_f32 mismatch at n={n}"
            );
            assert!(
                close(sum_f32(&a), sum_f32_scalar(&a)),
                "sum_f32 mismatch at n={n}"
            );
            assert!(
                close(l1_f32(&a), l1_f32_scalar(&a)),
                "l1_f32 mismatch at n={n}"
            );
            assert!(
                close(
                    squared_diff_sum_f32(&a, &b),
                    squared_diff_sum_f32_scalar(&a, &b)
                ),
                "squared_diff_sum_f32 mismatch at n={n}"
            );
            assert_eq!(
                max_abs_f32(&a),
                max_abs_f32_scalar(&a),
                "max_abs_f32 mismatch at n={n}"
            );
            assert_eq!(
                max_f32(&a),
                max_f32_scalar(&a),
                "max_f32 mismatch at n={n}"
            );
        }
    }

    #[test]
    fn dispatch_agrees_with_config_backend() {
        #[cfg(target_arch = "aarch64")]
        let picked = "neon";
        #[cfg(target_arch = "x86_64")]
        let picked = if std::arch::is_x86_feature_detected!("avx2") {
            "avx2"
        } else if std::arch::is_x86_feature_detected!("sse2") {
            "sse2"
        } else {
            "scalar"
        };
        #[cfg(not(any(target_arch = "aarch64", target_arch = "x86_64")))]
        let picked = "scalar";
        assert_eq!(crate::config::simd_backend(), picked);
    }

    #[test]
    #[should_panic]
    fn dot_f32_length_mismatch_panics() {
        dot_f32(&[1.0], &[1.0, 2.0]);
    }

    #[test]
    #[should_panic]
    fn squared_diff_sum_f32_length_mismatch_panics() {
        squared_diff_sum_f32(&[1.0], &[1.0, 2.0]);
    }

    /// Directly exercises the x86_64 kernels (bypassing runtime dispatch) so
    /// both AVX2 and SSE2 code paths are covered even when the host CPU has
    /// AVX2 (the dispatcher would never pick SSE2).
    #[cfg(target_arch = "x86_64")]
    mod x86_kernels {
        use super::*;

        #[test]
        fn avx2_kernels_match_scalar() {
            if !std::arch::is_x86_feature_detected!("avx2") {
                return; // cannot execute AVX2 on this CPU
            }
            for &n in &LENGTHS {
                let a = Lcg(0x2545_F491).vec(n);
                let b = Lcg(0x9E37_79B9).vec(n);
                assert!(
                    close(unsafe { dot_f32_avx2(&a, &b) }, dot_f32_scalar(&a, &b)),
                    "avx2 dot n={n}"
                );
                assert!(
                    close(unsafe { sum_f32_avx2(&a) }, sum_f32_scalar(&a)),
                    "avx2 sum n={n}"
                );
                assert!(
                    close(unsafe { l1_f32_avx2(&a) }, l1_f32_scalar(&a)),
                    "avx2 l1 n={n}"
                );
                assert!(
                    close(
                        unsafe { squared_diff_sum_f32_avx2(&a, &b) },
                        squared_diff_sum_f32_scalar(&a, &b)
                    ),
                    "avx2 squared_diff_sum n={n}"
                );
                assert_eq!(
                    unsafe { max_abs_f32_avx2(&a) },
                    max_abs_f32_scalar(&a),
                    "avx2 max_abs n={n}"
                );
                assert_eq!(
                    unsafe { max_f32_avx2(&a) },
                    max_f32_scalar(&a),
                    "avx2 max n={n}"
                );
            }
        }

        #[test]
        fn sse2_kernels_match_scalar() {
            // SSE2 is the x86_64 baseline — always executable.
            for &n in &LENGTHS {
                let a = Lcg(0x2545_F491).vec(n);
                let b = Lcg(0x9E37_79B9).vec(n);
                assert!(
                    close(unsafe { dot_f32_sse2(&a, &b) }, dot_f32_scalar(&a, &b)),
                    "sse2 dot n={n}"
                );
                assert!(
                    close(unsafe { sum_f32_sse2(&a) }, sum_f32_scalar(&a)),
                    "sse2 sum n={n}"
                );
                assert!(
                    close(unsafe { l1_f32_sse2(&a) }, l1_f32_scalar(&a)),
                    "sse2 l1 n={n}"
                );
                assert!(
                    close(
                        unsafe { squared_diff_sum_f32_sse2(&a, &b) },
                        squared_diff_sum_f32_scalar(&a, &b)
                    ),
                    "sse2 squared_diff_sum n={n}"
                );
                assert_eq!(
                    unsafe { max_abs_f32_sse2(&a) },
                    max_abs_f32_scalar(&a),
                    "sse2 max_abs n={n}"
                );
                assert_eq!(
                    unsafe { max_f32_sse2(&a) },
                    max_f32_scalar(&a),
                    "sse2 max n={n}"
                );
            }
        }
    }
}
