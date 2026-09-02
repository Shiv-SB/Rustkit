pub fn mutual_information_f32(
    joint: &[f32],
    marginal_x: &[f32],
    marginal_y: &[f32],
    rows: usize,
    cols: usize,
) -> f32 {
    assert_eq!(joint.len(), rows * cols);
    assert_eq!(marginal_x.len(), rows);
    assert_eq!(marginal_y.len(), cols);

    let mut mi = 0.0;
    for (i, &px) in marginal_x.iter().enumerate() {
        for (j, &py) in marginal_y.iter().enumerate() {
            let pxy = joint[i * cols + j];
            if pxy > 0.0 && px > 0.0 && py > 0.0 {
                mi += pxy * (pxy / (px * py)).log2();
            }
        }
    }
    mi
}
