pub fn jaro_winkler(a: &[u8], b: &[u8]) -> f32 {
    if a.is_empty() && b.is_empty() {
        return 1.0;
    }
    if a.is_empty() || b.is_empty() {
        return 0.0;
    }

    let n = a.len();
    let m = b.len();
    let match_dist = n.max(m) / 2;

    let mut a_matched = vec![false; n];
    let mut b_matched = vec![false; m];
    let mut matches = 0usize;

    for i in 0..n {
        let lo = i.saturating_sub(match_dist);
        let hi = (i + match_dist + 1).min(m);
        for j in lo..hi {
            if !b_matched[j] && a[i] == b[j] {
                a_matched[i] = true;
                b_matched[j] = true;
                matches += 1;
                break;
            }
        }
    }

    if matches == 0 {
        return 0.0;
    }

    let mut a_chars = Vec::with_capacity(matches);
    let mut b_chars = Vec::with_capacity(matches);
    for (i, &matched) in a_matched.iter().enumerate() {
        if matched {
            a_chars.push(a[i]);
        }
    }
    for (j, &matched) in b_matched.iter().enumerate() {
        if matched {
            b_chars.push(b[j]);
        }
    }

    let transpositions = a_chars
        .iter()
        .zip(&b_chars)
        .filter(|(x, y)| x != y)
        .count()
        / 2;

    let mf = matches as f32;
    let jaro = (mf / n as f32 + mf / m as f32 + (mf - transpositions as f32) / mf) / 3.0;

    let prefix = a
        .iter()
        .zip(b)
        .take(4)
        .take_while(|(x, y)| x == y)
        .count();

    jaro + prefix as f32 * 0.1 * (1.0 - jaro)
}
