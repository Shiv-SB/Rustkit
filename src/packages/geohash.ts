import { nativeGeohash, ptr } from "../native";

export function encode(
    lat: number,
    lng: number,
    precision: number
): string {
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
        ptr(hashBytes),
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
    const encoder = new TextEncoder();
    const hashBytes = encoder.encode(hash);

    const out = new Uint8Array(hashBytes.length);

    nativeGeohash.symbols.rk_geohash_neighbor(
        ptr(hashBytes),
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
        ptr(hashBytes),
        hashBytes.length
    );
}

export function allNeighbors(hash: string): string[] {
    const encoder = new TextEncoder();
    const hashBytes = encoder.encode(hash);

    const out = new Uint8Array(hashBytes.length * 8);

    nativeGeohash.symbols.rk_geohash_all_neighbors(
        ptr(hashBytes),
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
        ptr(hashBytes),
        hashBytes.length,
        ptr(minLat),
        ptr(minLng),
        ptr(maxLat),
        ptr(maxLng)
    );

    return { minLat: minLat[0]!, minLng: minLng[0]!, maxLat: maxLat[0]!, maxLng: maxLng[0]! };
}
