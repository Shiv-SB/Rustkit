const CODE: [u8; 26] = [
    0, 1, 2, 3, 0, 1, 2, 0, 0, 2, 2, 4, 5, 5, 0, 1, 2, 6, 2, 3, 0, 1, 0, 2, 0, 2,
];

// Writes 4-byte soundex code into out. Total: never panics on any input.
// Non-alphabetic characters are skipped entirely; if no alphabetic
// character is present the code is "0000".
pub fn soundex(input: &[u8], out: &mut [u8; 4]) {
    let mut code = [b'0'; 4];
    let mut idx = 0usize;
    let mut prev_digit = 0u8;

    for &c in input {
        let uc = c.to_ascii_uppercase();
        if !uc.is_ascii_alphabetic() {
            continue;
        }

        let digit = CODE[(uc - b'A') as usize];

        if idx == 0 {
            code[0] = uc;
            idx = 1;
            prev_digit = digit;
        } else if idx < 4 {
            if uc == b'H' || uc == b'W' {
                continue;
            }
            if digit != 0 && digit != prev_digit {
                code[idx] = b'0' + digit;
                idx += 1;
            }
            prev_digit = digit;
        }
    }

    *out = code;
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn skips_non_alphabetic_chars() {
        let mut out = [0u8; 4];
        soundex(b"Robert1", &mut out);
        assert_eq!(&out, b"R163");
    }

    #[test]
    fn all_non_alphabetic_is_zeros() {
        let mut out = [0u8; 4];
        soundex(b"123", &mut out);
        assert_eq!(&out, b"0000");
    }

    #[test]
    fn empty_input_is_zeros() {
        let mut out = [0u8; 4];
        soundex(b"", &mut out);
        assert_eq!(&out, b"0000");
    }

    #[test]
    fn mixed_case_matches_uppercase() {
        let mut a = [0u8; 4];
        let mut b = [0u8; 4];
        soundex(b"Robert", &mut a);
        soundex(b"robert", &mut b);
        assert_eq!(a, b);
    }
}