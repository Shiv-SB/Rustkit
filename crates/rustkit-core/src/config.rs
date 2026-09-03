pub fn version() -> &'static str {
    env!("CARGO_PKG_VERSION")
}

pub fn simd_backend() -> &'static str {
    #[cfg(target_arch = "aarch64")]
    {
        "neon"
    }
    #[cfg(not(target_arch = "aarch64"))]
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