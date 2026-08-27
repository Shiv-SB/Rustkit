pub fn aead_decrypt(
    key: &[u8; 32],
    nonce: &[u8; 12],
    aad: &[u8],
    ciphertext: &[u8],
    out: &mut [u8],
) -> Result<usize, ()> {
    todo!()
}
