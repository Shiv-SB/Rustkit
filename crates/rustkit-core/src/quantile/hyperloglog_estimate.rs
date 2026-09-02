pub fn hyperloglog_estimate(sketch: &[u8]) -> f64 {
    assert!(!sketch.is_empty());

    let m = sketch.len() as f64;
    let sum: f64 = sketch.iter().map(|&r| 2.0f64.powi(-(r as i32))).sum();

    let alpha = match sketch.len() {
        16 => 0.673,
        32 => 0.697,
        64 => 0.709,
        _ => 0.7213 / (1.0 + 1.079 / m),
    };

    let mut estimate = alpha * m * m / sum;

    let zeros = sketch.iter().filter(|&&r| r == 0).count() as f64;
    if zeros > 0.0 && estimate < 2.5 * m {
        estimate = m * (m / zeros).ln();
    }

    estimate
}
