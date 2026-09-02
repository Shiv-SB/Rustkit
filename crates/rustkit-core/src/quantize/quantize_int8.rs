use crate::simd;

pub fn quantize_int8_f32(a: &[f32], out: &mut [i8]) -> f32 {
    assert_eq!(a.len(), out.len());

    let max_abs = simd::max_abs_f32(a);
    let scale = if max_abs > 0.0 { max_abs / 127.0 } else { 0.0 };

    for (o, &x) in out.iter_mut().zip(a) {
        if scale == 0.0 {
            *o = 0;
        } else {
            *o = (x / scale).round().clamp(-128.0, 127.0) as i8;
        }
    }

    scale
}
