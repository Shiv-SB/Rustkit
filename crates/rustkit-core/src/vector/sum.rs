pub fn sum_f32(a: &[f32]) -> f32 {
    let mut sum = 0.0;
    for i in 0..a.len() {
        sum += a[i];
    }
    sum
}
