use crate::stats::{mean_f32, stddev_f32};

pub fn kurtosis_f32(a: &[f32]) -> f32 {
    assert!(!a.is_empty());

    let mean = mean_f32(a);
    let std = stddev_f32(a);

    if std == 0.0 {
        return 0.0;
    }

    let n = a.len() as f32;
    let m4 = a.iter().map(|x| (x - mean).powi(4)).sum::<f32>() / n;
    m4 / (std * std * std * std) - 3.0
}
