pub fn zero_f32(out: &mut [f32]) {
    for i in 0..out.len() {
        out[i] = 0.0;
    }
}
