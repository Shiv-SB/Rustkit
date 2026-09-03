pub fn version() -> &'static str {
    env!("CARGO_PKG_VERSION")
}

pub fn simd_backend() -> &'static str {
    #[cfg(target_arch = "aarch64")]
    {
        "neon"
    }
    // Runtime detection (not compile-time target features) so cross-built
    // x86 binaries run on CPUs without AVX2. Must stay in sync with the
    // dispatch order in `simd.rs` (avx2, then sse2, then scalar).
    #[cfg(target_arch = "x86_64")]
    {
        if std::arch::is_x86_feature_detected!("avx2") {
            "avx2"
        } else if std::arch::is_x86_feature_detected!("sse2") {
            "sse2"
        } else {
            "scalar"
        }
    }
    #[cfg(not(any(target_arch = "aarch64", target_arch = "x86_64")))]
    {
        "scalar"
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn version_is_semver() {
        assert!(version().split('.').count() >= 2);
    }

    #[test]
    fn simd_backend_is_known() {
        assert!(matches!(simd_backend(), "neon" | "scalar" | "avx2" | "sse2"));
    }
}