pub fn dequantize_int8_f32(quantized: &[i8], scale: f32, out: &mut [f32]) {
    assert_eq!(quantized.len(), out.len());
    for (o, &q) in out.iter_mut().zip(quantized) {
        *o = q as f32 * scale;
    }
}
