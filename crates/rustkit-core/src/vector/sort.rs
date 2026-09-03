pub fn sort_f32(a: &mut [f32]) {
    a.sort_by(|x, y| x.partial_cmp(y).unwrap_or(std::cmp::Ordering::Equal));
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn sorts_ascending() {
        let mut a = [3.0, 1.0, 2.0];
        sort_f32(&mut a);
        assert_eq!(a, [1.0, 2.0, 3.0]);
    }

    #[test]
    fn handles_negatives_and_duplicates() {
        let mut a = [-1.0, 5.0, -1.0, 0.0];
        sort_f32(&mut a);
        assert_eq!(a, [-1.0, -1.0, 0.0, 5.0]);
    }

    #[test]
    fn empty_is_noop() {
        let mut a: [f32; 0] = [];
        sort_f32(&mut a);
    }
}