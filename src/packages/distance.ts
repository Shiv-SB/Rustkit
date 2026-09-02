import { nativeDistance, ptr } from "../native";

/**
 * Computes the Euclidean (L2) distance between two vectors.
 *
 * @param a - First input vector.
 * @param b - Second input vector.
 * @returns The L2 distance `sqrt(sum((a[i] - b[i])^2))`.
 * @throws {Error} If `a` and `b` have different lengths.
 */
export function euclidean(
    a: Float32Array,
    b: Float32Array
): number {
    if (a.length !== b.length) {
        throw new Error("Vectors must have the same length");
    }

    return nativeDistance.symbols.rk_distance_euclidean_f32(
        ptr(a),
        ptr(b),
        a.length
    );
}

/**
 * Computes the Manhattan (L1) distance between two vectors.
 *
 * @param a - First input vector.
 * @param b - Second input vector.
 * @returns The L1 distance `sum(|a[i] - b[i]|)`.
 * @throws {Error} If `a` and `b` have different lengths.
 */
export function manhattan(
    a: Float32Array,
    b: Float32Array
): number {
    if (a.length !== b.length) {
        throw new Error("Vectors must have the same length");
    }

    return nativeDistance.symbols.rk_distance_manhattan_f32(
        ptr(a),
        ptr(b),
        a.length
    );
}

/**
 * Computes the cosine similarity between two vectors.
 *
 * @param a - First input vector.
 * @param b - Second input vector.
 * @returns The cosine similarity `dot(a, b) / (norm(a) * norm(b))`.
 * @throws {Error} If `a` and `b` have different lengths.
 */
export function cosineSimilarity(
    a: Float32Array,
    b: Float32Array
): number {
    if (a.length !== b.length) {
        throw new Error("Vectors must have the same length");
    }

    return nativeDistance.symbols.rk_distance_cosine_similarity_f32(
        ptr(a),
        ptr(b),
        a.length
    );
}

/**
 * Computes the Hamming distance between two integer vectors
 * (number of positions where the elements differ).
 *
 * @param a - First input vector.
 * @param b - Second input vector.
 * @returns The number of indices `i` where `a[i] !== b[i]`.
 * @throws {Error} If `a` and `b` have different lengths.
 */
export function hammingDistance(
    a: Int32Array,
    b: Int32Array
): number {
    if (a.length !== b.length) {
        throw new Error("Vectors must have the same length");
    }

    return Number(nativeDistance.symbols.rk_distance_hamming_distance_i32(
        ptr(a),
        ptr(b),
        a.length
    ));
}

/**
 * Computes the Jaccard similarity between two integer vectors
 * treated as sets: `|intersection| / |union|`.
 *
 * @param a - First input vector (treated as a set of values).
 * @param b - Second input vector (treated as a set of values).
 * @returns The Jaccard index in `[0, 1]`.
 */
export function jaccardSimilarity(
    a: Int32Array,
    b: Int32Array
): number {
    return nativeDistance.symbols.rk_distance_jaccard_similarity_i32(
        ptr(a),
        a.length,
        ptr(b),
        b.length
    );
}

/**
 * Computes the Chebyshev (L-infinity) distance between two vectors.
 *
 * @param a - First input vector.
 * @param b - Second input vector.
 * @returns The L-infinity distance `max(|a[i] - b[i]|)`.
 * @throws {Error} If `a` and `b` have different lengths.
 */
export function chebyshev(
    a: Float32Array,
    b: Float32Array
): number {
    if (a.length !== b.length) {
        throw new Error("Vectors must have the same length");
    }

    return nativeDistance.symbols.rk_distance_chebyshev_f32(
        ptr(a),
        ptr(b),
        a.length
    );
}
