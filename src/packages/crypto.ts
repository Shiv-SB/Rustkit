import { nativeCrypto, ptr } from "../native";

// Bun's `ptr()` rejects empty typed arrays (null backing pointer), so pass a
// dummy 1-byte buffer when the input is empty and rely on the length argument.
const EMPTY = new Uint8Array(1);

function ffiPtr(data: Uint8Array) {
    return data.length === 0 ? ptr(EMPTY) : ptr(data);
}

/**
 * Computes the CRC-32 checksum of the input bytes.
 *
 * @param data - Input bytes.
 * @returns The 32-bit checksum as an unsigned integer.
 */
export function crc32(data: Uint8Array): number {
    return nativeCrypto.symbols.rk_crypto_crc32(ffiPtr(data), data.length);
}

/**
 * Computes the 64-bit xxHash of the input bytes.
 *
 * @param data - Input bytes.
 * @param seed - Optional seed (default 0).
 * @returns The 64-bit hash as a bigint.
 */
export function xxhash64(data: Uint8Array, seed: number = 0): bigint {
    return nativeCrypto.symbols.rk_crypto_xxhash64(ffiPtr(data), data.length, seed);
}

/**
 * Computes the 64-bit FNV-1a hash of the input bytes.
 *
 * @param data - Input bytes.
 * @returns The 64-bit hash as a bigint.
 */
export function fnv1a(data: Uint8Array): bigint {
    return nativeCrypto.symbols.rk_crypto_fnv1a(ffiPtr(data), data.length);
}

/**
 * Computes the BLAKE3 hash of the input bytes.
 *
 * @param data - Input bytes.
 * @returns A new 32-byte Uint8Array containing the hash.
 */
export function blake3(data: Uint8Array): Uint8Array {
    const out = new Uint8Array(32);

    nativeCrypto.symbols.rk_crypto_blake3(
        ffiPtr(data),
        data.length,
        ptr(out)
    );

    return out;
}

/**
 * Computes the MurmurHash3 (x86 32-bit) hash of the input bytes.
 *
 * @param data - Input bytes.
 * @param seed - Optional seed (default 0).
 * @returns The 32-bit hash as an unsigned integer.
 */
export function murmur3(data: Uint8Array, seed: number = 0): number {
    return nativeCrypto.symbols.rk_crypto_murmur3(ffiPtr(data), data.length, seed);
}