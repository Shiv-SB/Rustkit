pub fn fill_f32(out: &mut [f32], val: f32) {
    for i in 0..out.len() {
        out[i] = val;
    }
}
