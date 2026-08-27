import { native, ptr } from "../native";

export function encode(
    lat: number,
    lng: number,
    precision: number
): string {
    const out = new Uint8Array(precision);

    native.symbols.rk_geohash_encode(lat, lng, precision, ptr(out));

    return new TextDecoder().decode(out);
}

export function decode(hash: string): { lat: number; lng: number } {
    const encoder = new TextEncoder();
    const hashBytes = encoder.encode(hash);

    const lat = new Float64Array(1);
    const lng = new Float64Array(1);

    native.symbols.rk_geohash_decode(
        ptr(hashBytes),
        hashBytes.length,
        ptr(lat),
        ptr(lng)
    );

    return { lat: lat[0], lng: lng[0] };
}

export function neighbor(
    hash: string,
    direction: number
): string {
    const encoder = new TextEncoder();
    const hashBytes = encoder.encode(hash);

    const out = new Uint8Array(hashBytes.length);

    native.symbols.rk_geohash_neighbor(
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
    return native.symbols.rk_geohash_distance(aLat, aLng, bLat, bLng);
}
