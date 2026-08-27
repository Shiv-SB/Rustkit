pub fn clamp_f32(a: &mut [f32], min: f32, max: f32) {
    for i in 0..a.len() {
        if a[i] < min {
            a[i] = min;
        } else if a[i] > max {
            a[i] = max;
        }
    }
}
