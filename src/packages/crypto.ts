import { nativeCrypto, ptr } from "../native";

export function crc32(data: Uint8Array): number {
    return nativeCrypto.symbols.rk_crypto_crc32(ptr(data), data.length);
}

export function xxhash64(data: Uint8Array, seed: number = 0): bigint {
    return nativeCrypto.symbols.rk_crypto_xxhash64(ptr(data), data.length, seed);
}

export function fnv1a(data: Uint8Array): bigint {
    return nativeCrypto.symbols.rk_crypto_fnv1a(ptr(data), data.length);
}

export function blake3(data: Uint8Array): Uint8Array {
    const out = new Uint8Array(32);

    nativeCrypto.symbols.rk_crypto_blake3(
        ptr(data),
        data.length,
        ptr(out)
    );

    return out;
}

export function murmur3(data: Uint8Array, seed: number = 0): number {
    return nativeCrypto.symbols.rk_crypto_murmur3(ptr(data), data.length, seed);
}
