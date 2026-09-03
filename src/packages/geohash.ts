import { nativeGeohash, ptr } from "../native";

// Bun's `ptr()` rejects empty typed arrays (null backing pointer), so pass a
// dummy 1-byte buffer when the input is empty and rely on the length argument.
const EMPTY = new Uint8Array(1);

function ffiPtr(bytes: Uint8Array) {
    return bytes.length === 0 ? ptr(EMPTY) : ptr(bytes);
}

/**
 * Encodes a latitude/longitude pair into a geohash string.
 *
 * @param lat - Latitude in degrees.
 * @param lng - Longitude in degrees.
 * @param precision - Number of characters in the hash, an integer in
 * `[1, 12]`.
 * @returns The geohash string of the given length.
 * @throws {Error} If `precision` is not an integer in `[1, 12]`.
 */
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

/**
 * Decodes a geohash string into the coordinates of its cell center.
 *
 * @param hash - Geohash string.
 * @returns The center `{ lat, lng }` of the cell in degrees.
 */
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

/**
 * Returns the geohash of the cell adjacent to `hash` in the given
 * direction.
 *
 * @param hash - Source geohash.
 * @param direction - Compass direction as an integer in `[0, 7]` (0 = N,
 * 1 = NE, 2 = E, 3 = SE, 4 = S, 5 = SW, 6 = W, 7 = NW).
 * @returns The neighboring geohash, same length as `hash`.
 * @throws {Error} If `direction` is not an integer in `[0, 7]`.
 */
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

/**
 * Computes the great-circle distance between two coordinates.
 *
 * @param aLat - Latitude of point A in degrees.
 * @param aLng - Longitude of point A in degrees.
 * @param bLat - Latitude of point B in degrees.
 * @param bLng - Longitude of point B in degrees.
 * @returns The distance in kilometers.
 */
export function distance(
    aLat: number,
    aLng: number,
    bLat: number,
    bLng: number
): number {
    return nativeGeohash.symbols.rk_geohash_distance(aLat, aLng, bLat, bLng);
}

/**
 * Checks whether a string is a valid geohash.
 *
 * @param hash - String to validate.
 * @returns `true` if `hash` uses only geohash characters and has a valid
 * length, `false` otherwise.
 */
export function isValid(hash: string): boolean {
    const encoder = new TextEncoder();
    const hashBytes = encoder.encode(hash);

    return nativeGeohash.symbols.rk_geohash_is_valid(
        ffiPtr(hashBytes),
        hashBytes.length
    );
}

/**
 * Returns all 8 neighboring geohashes of a cell.
 *
 * @param hash - Source geohash.
 * @returns An array of 8 geohashes, same length as `hash`, in compass
 * order (N, NE, E, SE, S, SW, W, NW).
 */
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

/**
 * Computes the bounding box of a geohash cell.
 *
 * @param hash - Geohash string.
 * @returns The cell bounds `{ minLat, minLng, maxLat, maxLng }` in degrees.
 */
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
