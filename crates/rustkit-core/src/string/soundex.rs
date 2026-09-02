const CODE: [u8; 26] = [
    0, 1, 2, 3, 0, 1, 2, 0, 0, 2, 2, 4, 5, 5, 0, 1, 2, 6, 2, 3, 0, 1, 0, 2, 0, 2,
];

// Writes 4-byte soundex code into out
pub fn soundex(input: &[u8], out: &mut [u8; 4]) {
    if input.is_empty() {
        *out = *b"0000";
        return;
    }

    let mut code = [0u8; 4];
    code[0] = input[0].to_ascii_uppercase();

    let mut prev_digit = CODE[(input[0].to_ascii_uppercase() - b'A') as usize];
    let mut idx = 1;

    for &c in &input[1..] {
        if idx >= 4 {
            break;
        }

        let uc = c.to_ascii_uppercase();
        if uc == b'H' || uc == b'W' {
            continue;
        }
        let digit = CODE[(uc - b'A') as usize];
        if digit != 0 && digit != prev_digit {
            code[idx] = b'0' + digit;
            idx += 1;
        }
        prev_digit = digit;
    }

    while idx < 4 {
        code[idx] = b'0';
        idx += 1;
    }

    *out = code;
}
