use crate::stats::{mean_f32, stddev_f32};

pub fn zscore_f32(a: &mut [f32]) {
    assert!(!a.is_empty());

    let mean = mean_f32(a);
    let std = stddev_f32(a);

    if std == 0.0 {
        a.fill(0.0);
        return;
    }

    for x in a.iter_mut() {
        *x = (*x - mean) / std;
    }
}
