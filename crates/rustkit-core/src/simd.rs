//! Explicit SIMD reduction kernels.
//!
//! On AArch64 these use NEON intrinsics directly; other targets fall back
//! to scalar loops that LLVM auto-vectorizes in release builds.

pub fn dot_f32(a: &[f32], b: &[f32]) -> f32 {
    assert_eq!(a.len(), b.len());
    #[cfg(target_arch = "aarch64")]
    {
        unsafe { dot_f32_neon(a, b) }
    }
    #[cfg(not(target_arch = "aarch64"))]
    {
        dot_f32_scalar(a, b)
    }
}

pub fn sum_f32(a: &[f32]) -> f32 {
    #[cfg(target_arch = "aarch64")]
    {
        unsafe { sum_f32_neon(a) }
    }
    #[cfg(not(target_arch = "aarch64"))]
    {
        sum_f32_scalar(a)
    }
}

pub fn l1_f32(a: &[f32]) -> f32 {
    #[cfg(target_arch = "aarch64")]
    {
        unsafe { l1_f32_neon(a) }
    }
    #[cfg(not(target_arch = "aarch64"))]
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
    #[cfg(not(target_arch = "aarch64"))]
    {
        squared_diff_sum_f32_scalar(a, b)
    }
}

pub fn max_abs_f32(a: &[f32]) -> f32 {
    #[cfg(target_arch = "aarch64")]
    {
        unsafe { max_abs_f32_neon(a) }
    }
    #[cfg(not(target_arch = "aarch64"))]
    {
        max_abs_f32_scalar(a)
    }
}

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

#[cfg(not(target_arch = "aarch64"))]
#[allow(dead_code)]
fn dot_f32_scalar(a: &[f32], b: &[f32]) -> f32 {
    a.iter().zip(b).map(|(&x, &y)| x * y).sum()
}

#[cfg(not(target_arch = "aarch64"))]
#[allow(dead_code)]
fn sum_f32_scalar(a: &[f32]) -> f32 {
    a.iter().sum()
}

#[cfg(not(target_arch = "aarch64"))]
#[allow(dead_code)]
fn l1_f32_scalar(a: &[f32]) -> f32 {
    a.iter().map(|x| x.abs()).sum()
}

#[cfg(not(target_arch = "aarch64"))]
#[allow(dead_code)]
fn squared_diff_sum_f32_scalar(a: &[f32], b: &[f32]) -> f32 {
    a.iter().zip(b).map(|(&x, &y)| (x - y) * (x - y)).sum()
}

#[cfg(not(target_arch = "aarch64"))]
#[allow(dead_code)]
fn max_abs_f32_scalar(a: &[f32]) -> f32 {
    a.iter().map(|x| x.abs()).fold(0.0, f32::max)
}