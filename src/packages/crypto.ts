import { nativeCrypto, ptr } from "../native";

export function crc32(data: Uint8Array): number {
    return nativeCrypto.symbols.rk_crypto_crc32(ptr(data), data.length);
}

export function xxhash64(data: Uint8Array, seed: number = 0): bigint {
    return nativeCrypto.symbols.rk_crypto_xxhash64(ptr(data), data.length, seed);
}

export function aeadEncrypt(
    key: Uint8Array,
    nonce: Uint8Array,
    aad: Uint8Array | null,
    plaintext: Uint8Array
): Uint8Array {
    if (key.length !== 32) {
        throw new Error("Key must be 32 bytes");
    }
    if (nonce.length !== 12) {
        throw new Error("Nonce must be 12 bytes");
    }

    const out = new Uint8Array(plaintext.length + 16);

    nativeCrypto.symbols.rk_crypto_aead_encrypt(
        ptr(key),
        ptr(nonce),
        aad ? ptr(aad) : null,
        aad ? aad.length : 0,
        ptr(plaintext),
        plaintext.length,
        ptr(out)
    );

    return out;
}

export function aeadDecrypt(
    key: Uint8Array,
    nonce: Uint8Array,
    aad: Uint8Array | null,
    ciphertext: Uint8Array
): Uint8Array {
    if (key.length !== 32) {
        throw new Error("Key must be 32 bytes");
    }
    if (nonce.length !== 12) {
        throw new Error("Nonce must be 12 bytes");
    }
    if (ciphertext.length < 16) {
        throw new Error("Ciphertext too short");
    }

    const out = new Uint8Array(ciphertext.length - 16);

    const success = nativeCrypto.symbols.rk_crypto_aead_decrypt(
        ptr(key),
        ptr(nonce),
        aad ? ptr(aad) : null,
        aad ? aad.length : 0,
        ptr(ciphertext),
        ciphertext.length,
        ptr(out)
    );

    if (!success) {
        throw new Error("Decryption failed");
    }

    return out;
}

export function chacha20(
    key: Uint8Array,
    nonce: Uint8Array,
    counter: number,
    input: Uint8Array
): Uint8Array {
    if (key.length !== 32) {
        throw new Error("Key must be 32 bytes");
    }
    if (nonce.length !== 12) {
        throw new Error("Nonce must be 12 bytes");
    }

    const out = new Uint8Array(input.length);

    nativeCrypto.symbols.rk_crypto_chacha20(
        ptr(key),
        ptr(nonce),
        counter,
        ptr(input),
        input.length,
        ptr(out)
    );

    return out;
}
