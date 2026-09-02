import { nativeCrypto, ptr } from "../native";

// Bun's `ptr()` rejects empty typed arrays (null backing pointer), so pass a
// dummy 1-byte buffer when the input is empty and rely on the length argument.
const EMPTY = new Uint8Array(1);

function ffiPtr(data: Uint8Array) {
    return data.length === 0 ? ptr(EMPTY) : ptr(data);
}

export function crc32(data: Uint8Array): number {
    return nativeCrypto.symbols.rk_crypto_crc32(ffiPtr(data), data.length);
}

export function xxhash64(data: Uint8Array, seed: number = 0): bigint {
    return nativeCrypto.symbols.rk_crypto_xxhash64(ffiPtr(data), data.length, seed);
}

export function fnv1a(data: Uint8Array): bigint {
    return nativeCrypto.symbols.rk_crypto_fnv1a(ffiPtr(data), data.length);
}

export function blake3(data: Uint8Array): Uint8Array {
    const out = new Uint8Array(32);

    nativeCrypto.symbols.rk_crypto_blake3(
        ffiPtr(data),
        data.length,
        ptr(out)
    );

    return out;
}

export function murmur3(data: Uint8Array, seed: number = 0): number {
    return nativeCrypto.symbols.rk_crypto_murmur3(ffiPtr(data), data.length, seed);
}