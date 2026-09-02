pub fn histogram_f32(a: &[f32], bins: usize, out: &mut [u32]) {
    assert!(!a.is_empty());
    assert!(bins > 0);
    assert_eq!(out.len(), bins);

    out.fill(0);

    let min = a.iter().copied().fold(f32::INFINITY, f32::min);
    let max = a.iter().copied().fold(f32::NEG_INFINITY, f32::max);

    if min == max {
        out[0] = a.len() as u32;
        return;
    }

    let range = max - min;
    for &x in a {
        let mut bin = ((x - min) / range * bins as f32) as usize;
        if bin >= bins {
            bin = bins - 1;
        }
        out[bin] += 1;
    }
}
