pub fn dequantize_int4_f32(quantized: &[u8], scale: f32, out: &mut [f32]) {
    assert!(quantized.len() >= (out.len() + 1) / 2);

    for (i, o) in out.iter_mut().enumerate() {
        let byte = quantized[i / 2];
        let nibble = if i % 2 == 0 {
            byte & 0x0F
        } else {
            (byte >> 4) & 0x0F
        };
        let signed = if nibble >= 8 {
            nibble as i8 - 16
        } else {
            nibble as i8
        };
        *o = signed as f32 * scale;
    }
}
