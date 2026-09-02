use crate::simd;

pub fn quantize_int4_f32(a: &[f32], out: &mut [u8]) -> f32 {
    assert_eq!(out.len(), (a.len() + 1) / 2);

    let max_abs = simd::max_abs_f32(a);
    let scale = if max_abs > 0.0 { max_abs / 7.0 } else { 0.0 };

    for (i, &x) in a.iter().enumerate() {
        let q = if scale == 0.0 {
            0i8
        } else {
            (x / scale).round().clamp(-8.0, 7.0) as i8
        };
        let nibble = (q as u8) & 0x0F;
        if i % 2 == 0 {
            out[i / 2] = nibble;
        } else {
            out[i / 2] |= nibble << 4;
        }
    }

    scale
}
