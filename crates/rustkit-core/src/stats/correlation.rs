use crate::stats::{covariance_f32, stddev_f32};

pub fn correlation_f32(a: &[f32], b: &[f32]) -> f32 {
    assert_eq!(a.len(), b.len());
    assert!(!a.is_empty());

    let std_a = stddev_f32(a);
    let std_b = stddev_f32(b);

    if std_a == 0.0 || std_b == 0.0 {
        return 0.0;
    }

    covariance_f32(a, b) / (std_a * std_b)
}
