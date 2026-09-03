import { nativeGeohash, ptr } from "../native";

// Bun's `ptr()` rejects empty typed arrays (null backing pointer), so pass a
// dummy 1-byte buffer when the input is empty and rely on the length argument.
const EMPTY = new Uint8Array(1);

function ffiPtr(bytes: Uint8Array) {
    return bytes.length === 0 ? ptr(EMPTY) : ptr(bytes);
}

export function encode(
    lat: number,
    lng: number,
    precision: number
): string {
    if (!Number.isInteger(precision) || precision < 1 || precision > 12) {
        throw new Error("Precision must be an integer between 1 and 12");
    }

    const out = new Uint8Array(precision);

    nativeGeohash.symbols.rk_geohash_encode(lat, lng, precision, ptr(out));

    return new TextDecoder().decode(out);
}

export function decode(hash: string): { lat: number; lng: number } {
    const encoder = new TextEncoder();
    const hashBytes = encoder.encode(hash);

    const lat = new Float64Array(1);
    const lng = new Float64Array(1);

    nativeGeohash.symbols.rk_geohash_decode(
        ffiPtr(hashBytes),
        hashBytes.length,
        ptr(lat),
        ptr(lng)
    );

    return { lat: lat[0]!, lng: lng[0]! };
}

export function neighbor(
    hash: string,
    direction: number
): string {
    if (!Number.isInteger(direction) || direction < 0 || direction > 7) {
        throw new Error("Direction must be an integer between 0 and 7");
    }

    const encoder = new TextEncoder();
    const hashBytes = encoder.encode(hash);

    const out = new Uint8Array(hashBytes.length);

    nativeGeohash.symbols.rk_geohash_neighbor(
        ffiPtr(hashBytes),
        hashBytes.length,
        direction,
        ptr(out)
    );

    return new TextDecoder().decode(out);
}

export function distance(
    aLat: number,
    aLng: number,
    bLat: number,
    bLng: number
): number {
    return nativeGeohash.symbols.rk_geohash_distance(aLat, aLng, bLat, bLng);
}

export function isValid(hash: string): boolean {
    const encoder = new TextEncoder();
    const hashBytes = encoder.encode(hash);

    return nativeGeohash.symbols.rk_geohash_is_valid(
        ffiPtr(hashBytes),
        hashBytes.length
    );
}

export function allNeighbors(hash: string): string[] {
    const encoder = new TextEncoder();
    const hashBytes = encoder.encode(hash);

    const out = new Uint8Array(hashBytes.length * 8);

    nativeGeohash.symbols.rk_geohash_all_neighbors(
        ffiPtr(hashBytes),
        hashBytes.length,
        ptr(out)
    );

    const decoder = new TextDecoder();
    const neighbors: string[] = [];
    for (let i = 0; i < 8; i++) {
        const start = i * hashBytes.length;
        neighbors.push(decoder.decode(out.subarray(start, start + hashBytes.length)));
    }

    return neighbors;
}

export function bbox(hash: string): { minLat: number; minLng: number; maxLat: number; maxLng: number } {
    const encoder = new TextEncoder();
    const hashBytes = encoder.encode(hash);

    const minLat = new Float64Array(1);
    const minLng = new Float64Array(1);
    const maxLat = new Float64Array(1);
    const maxLng = new Float64Array(1);

    nativeGeohash.symbols.rk_geohash_bbox(
        ffiPtr(hashBytes),
        hashBytes.length,
        ptr(minLat),
        ptr(minLng),
        ptr(maxLat),
        ptr(maxLng)
    );

    return { minLat: minLat[0]!, minLng: minLng[0]!, maxLat: maxLat[0]!, maxLng: maxLng[0]! };
}
