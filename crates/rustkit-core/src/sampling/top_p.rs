/// Nucleus sampling. `a` is a probability distribution (values in `[0, 1]`,
/// typically summing to 1). Keeps the smallest set of tokens whose cumulative
/// probability (taken from the highest down) reaches `p`, zeroes the rest,
/// and renormalizes in place. `p` must be in `[0, 1]`; the TS wrapper
/// validates this.
pub fn top_p_f32(a: &mut [f32], p: f32) {
    if a.is_empty() {
        return;
    }

    let p = p.clamp(0.0, 1.0);
    let mut indices: Vec<usize> = (0..a.len()).collect();
    indices.sort_unstable_by(|&i, &j| {
        a[j].partial_cmp(&a[i]).unwrap_or(std::cmp::Ordering::Equal)
    });

    let mut keep = vec![false; a.len()];
    let mut cumulative = 0.0f32;
    for &i in &indices {
        keep[i] = true;
        cumulative += a[i];
        if cumulative >= p {
            break;
        }
    }

    let mut sum = 0.0f32;
    for (i, x) in a.iter_mut().enumerate() {
        if !keep[i] {
            *x = 0.0;
        }
        sum += *x;
    }

    if sum > 0.0 {
        for x in a.iter_mut() {
            *x /= sum;
        }
    }
}