pub fn longest_common_substr(a: &[u8], b: &[u8]) -> usize {
    let n = a.len();
    let m = b.len();

    if n == 0 || m == 0 {
        return 0;
    }

    let mut prev = vec![0usize; m + 1];
    let mut curr = vec![0usize; m + 1];
    let mut longest = 0;

    for i in 1..=n {
        for j in 1..=m {
            curr[j] = if a[i - 1] == b[j - 1] {
                prev[j - 1] + 1
            } else {
                0
            };
            longest = longest.max(curr[j]);
        }
        std::mem::swap(&mut prev, &mut curr);
    }

    longest
}
