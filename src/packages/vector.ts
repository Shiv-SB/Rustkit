import { nativeVector, ptr } from "../native";

/**
 * Adds two vectors element-wise.
 *
 * @param a - First input vector.
 * @param b - Second input vector.
 * @returns A new Float32Array containing the element-wise sum.
 * @throws {Error} If `a` and `b` have different lengths.
 */
export function add(
    a: Float32Array,
    b: Float32Array
): Float32Array {
    if (a.length !== b.length) {
        throw new Error("Vectors must have the same length");
    }

    const out = new Float32Array(a.length);

    nativeVector.symbols.rk_vector_add_f32(
        ptr(a),
        ptr(b),
        ptr(out),
        a.length
    );

    return out;
}

/**
 * Subtracts two vectors element-wise.
 *
 * @param a - First input vector.
 * @param b - Second input vector.
 * @returns A new Float32Array containing `a[i] - b[i]` for each element.
 * @throws {Error} If `a` and `b` have different lengths.
 */
export function sub(
    a: Float32Array,
    b: Float32Array
): Float32Array {
    if (a.length !== b.length) {
        throw new Error("Vectors must have the same length");
    }

    const out = new Float32Array(a.length);

    nativeVector.symbols.rk_vector_sub_f32(
        ptr(a),
        ptr(b),
        ptr(out),
        a.length
    );

    return out;
}

/**
 * Multiplies two vectors element-wise.
 *
 * @param a - First input vector.
 * @param b - Second input vector.
 * @returns A new Float32Array containing the element-wise product.
 * @throws {Error} If `a` and `b` have different lengths.
 */
export function mul(
    a: Float32Array,
    b: Float32Array
): Float32Array {
    if (a.length !== b.length) {
        throw new Error("Vectors must have the same length");
    }

    const out = new Float32Array(a.length);

    nativeVector.symbols.rk_vector_mul_f32(
        ptr(a),
        ptr(b),
        ptr(out),
        a.length
    );

    return out;
}

/**
 * Divides two vectors element-wise.
 *
 * @param a - Numerator vector.
 * @param b - Denominator vector.
 * @returns A new Float32Array containing `a[i] / b[i]` for each element.
 * @throws {Error} If `a` and `b` have different lengths.
 */
export function div(
    a: Float32Array,
    b: Float32Array
): Float32Array {
    if (a.length !== b.length) {
        throw new Error("Vectors must have the same length");
    }

    const out = new Float32Array(a.length);

    nativeVector.symbols.rk_vector_div_f32(
        ptr(a),
        ptr(b),
        ptr(out),
        a.length
    );

    return out;
}

/**
 * Computes the dot product of two vectors.
 *
 * @param a - First input vector.
 * @param b - Second input vector.
 * @returns The scalar dot product `sum(a[i] * b[i])`.
 * @throws {Error} If `a` and `b` have different lengths.
 */
export function dot(
    a: Float32Array,
    b: Float32Array
): number {
    if (a.length !== b.length) {
        throw new Error("Vectors must have the same length");
    }

    return nativeVector.symbols.rk_vector_dot_f32(
        ptr(a),
        ptr(b),
        a.length
    );
}

/**
 * Computes the cross product of two 3D vectors.
 *
 * @param a - First input vector (must have length 3).
 * @param b - Second input vector (must have length 3).
 * @returns A new Float32Array of length 3 containing the cross product.
 * @throws {Error} If either `a` or `b` does not have exactly 3 elements.
 */
export function cross(
    a: Float32Array,
    b: Float32Array
): Float32Array {
    if (a.length !== 3 || b.length !== 3) {
        throw new Error("Cross product requires vectors of length 3");
    }

    const out = new Float32Array(3);

    nativeVector.symbols.rk_vector_cross_f32(
        ptr(a),
        ptr(b),
        ptr(out),
        3
    );

    return out;
}

/**
 * Computes the L2 norm (Euclidean length) of a vector.
 *
 * @param a - Input vector.
 * @returns The L2 norm `sqrt(sum(a[i]^2))`.
 */
export function norm(
    a: Float32Array
): number {
    return nativeVector.symbols.rk_vector_norm_f32(
        ptr(a),
        a.length
    );
}

/**
 * Normalizes a vector to unit length (L2 norm of 1).
 *
 * @param a - Input vector.
 * @returns A new Float32Array where each element is `a[i] / norm(a)`.
 */
export function normalize(
    a: Float32Array
): Float32Array {
    const out = new Float32Array(a.length);

    nativeVector.symbols.rk_vector_normalize_f32(
        ptr(a),
        ptr(out),
        a.length
    );

    return out;
}

/**
 * Multiplies a vector by a scalar.
 *
 * @param a - Input vector.
 * @param scalar - Scalar multiplier.
 * @returns A new Float32Array containing `a[i] * scalar` for each element.
 */
export function scale(
    a: Float32Array,
    scalar: number
): Float32Array {
    const out = new Float32Array(a.length);

    nativeVector.symbols.rk_vector_scale_f32(
        ptr(a),
        scalar,
        ptr(out),
        a.length
    );

    return out;
}

/**
 * Returns the index of the minimum value in a vector.
 *
 * @param a - Input vector.
 * @returns The index of the smallest element.
 * @throws {Error} If the vector is empty.
 */
export function argmin(
    a: Float32Array
): number {
    if (a.length === 0) {
        throw new Error("Vector must not be empty");
    }

    return Number(nativeVector.symbols.rk_vector_argmin_f32(
        ptr(a),
        a.length
    ));
}

/**
 * Returns the index of the maximum value in a vector.
 *
 * @param a - Input vector.
 * @returns The index of the largest element.
 * @throws {Error} If the vector is empty.
 */
export function argmax(
    a: Float32Array
): number {
    if (a.length === 0) {
        throw new Error("Vector must not be empty");
    }

    return Number(nativeVector.symbols.rk_vector_argmax_f32(
        ptr(a),
        a.length
    ));
}

/**
 * Returns the sum of all elements in a vector.
 *
 * @param a - Input vector.
 * @returns The sum `sum(a[i])`.
 */
export function sum(
    a: Float32Array
): number {
    if (a.length === 0) {
        return 0;
    }

    return nativeVector.symbols.rk_vector_sum_f32(
        ptr(a),
        a.length
    );
}

/**
 * Returns the arithmetic mean of a vector.
 *
 * @param a - Input vector.
 * @returns The mean `sum(a) / a.length`.
 * @throws {Error} If the vector is empty.
 */
export function mean(
    a: Float32Array
): number {
    if (a.length === 0) {
        throw new Error("Vector must not be empty");
    }

    return nativeVector.symbols.rk_vector_mean_f32(
        ptr(a),
        a.length
    );
}

/**
 * Linearly interpolates between two vectors.
 *
 * @param a - Start vector.
 * @param b - End vector.
 * @param t - Interpolation factor (0 = `a`, 1 = `b`).
 * @returns A new Float32Array where each element is `a[i] + t * (b[i] - a[i])`.
 * @throws {Error} If `a` and `b` have different lengths.
 */
export function lerp(
    a: Float32Array,
    b: Float32Array,
    t: number
): Float32Array {
    if (a.length !== b.length) {
        throw new Error("Vectors must have the same length");
    }

    const out = new Float32Array(a.length);

    nativeVector.symbols.rk_vector_lerp_f32(
        ptr(a),
        ptr(b),
        t,
        ptr(out),
        a.length
    );

    return out;
}

/**
 * Clamps each element of a vector to `[min, max]`.
 *
 * @param a - Input vector (not mutated).
 * @param min - Minimum bound.
 * @param max - Maximum bound.
 * @returns A new Float32Array with each element clamped.
 */
export function clamp(
    a: Float32Array,
    min: number,
    max: number
): Float32Array {
    const out = new Float32Array(a);

    nativeVector.symbols.rk_vector_clamp_f32(
        ptr(out),
        min,
        max,
        out.length
    );

    return out;
}

/**
 * Computes the element-wise absolute value of a vector.
 *
 * @param a - Input vector.
 * @returns A new Float32Array where each element is `|a[i]|`.
 */
export function abs(
    a: Float32Array
): Float32Array {
    const out = new Float32Array(a.length);

    nativeVector.symbols.rk_vector_abs_f32(
        ptr(a),
        ptr(out),
        a.length
    );

    return out;
}

/**
 * Computes the element-wise minimum of two vectors.
 *
 * @param a - First input vector.
 * @param b - Second input vector.
 * @returns A new Float32Array where each element is `min(a[i], b[i])`.
 * @throws {Error} If `a` and `b` have different lengths.
 */
export function min(
    a: Float32Array,
    b: Float32Array
): Float32Array {
    if (a.length !== b.length) {
        throw new Error("Vectors must have the same length");
    }

    const out = new Float32Array(a.length);

    nativeVector.symbols.rk_vector_min_f32(
        ptr(a),
        ptr(b),
        ptr(out),
        a.length
    );

    return out;
}

/**
 * Computes the element-wise maximum of two vectors.
 *
 * @param a - First input vector.
 * @param b - Second input vector.
 * @returns A new Float32Array where each element is `max(a[i], b[i])`.
 * @throws {Error} If `a` and `b` have different lengths.
 */
export function max(
    a: Float32Array,
    b: Float32Array
): Float32Array {
    if (a.length !== b.length) {
        throw new Error("Vectors must have the same length");
    }

    const out = new Float32Array(a.length);

    nativeVector.symbols.rk_vector_max_f32(
        ptr(a),
        ptr(b),
        ptr(out),
        a.length
    );

    return out;
}

/**
 * Computes the element-wise square root of a vector.
 *
 * @param a - Input vector.
 * @returns A new Float32Array where each element is `sqrt(a[i])`.
 */
export function sqrt(
    a: Float32Array
): Float32Array {
    const out = new Float32Array(a.length);

    nativeVector.symbols.rk_vector_sqrt_f32(
        ptr(a),
        ptr(out),
        a.length
    );

    return out;
}

/**
 * Computes the element-wise reciprocal of a vector.
 *
 * @param a - Input vector.
 * @returns A new Float32Array where each element is `1 / a[i]`.
 */
export function reciprocal(
    a: Float32Array
): Float32Array {
    const out = new Float32Array(a.length);

    nativeVector.symbols.rk_vector_reciprocal_f32(
        ptr(a),
        ptr(out),
        a.length
    );

    return out;
}

/**
 * Computes the L1 norm (Manhattan norm) of a vector.
 *
 * @param a - Input vector.
 * @returns The L1 norm `sum(|a[i]|)`.
 */
export function l1Norm(
    a: Float32Array
): number {
    return nativeVector.symbols.rk_vector_l1_norm_f32(
        ptr(a),
        a.length
    );
}

/**
 * Computes the L-infinity norm (Chebyshev norm) of a vector.
 *
 * @param a - Input vector.
 * @returns The L-infinity norm `max(|a[i]|)`.
 */
export function lInfNorm(
    a: Float32Array
): number {
    return nativeVector.symbols.rk_vector_l_inf_norm_f32(
        ptr(a),
        a.length
    );
}

/**
 * Computes the outer product of two vectors.
 *
 * @param a - First input vector (length `rows`).
 * @param b - Second input vector (length `cols`).
 * @returns A new Float32Array of length `a.length * b.length` containing
 * the flattened outer product matrix where element `(i, j)` is `a[i] * b[j]`.
 */
export function outer(
    a: Float32Array,
    b: Float32Array
): Float32Array {
    const out = new Float32Array(a.length * b.length);

    nativeVector.symbols.rk_vector_outer_f32(
        ptr(a),
        ptr(b),
        ptr(out),
        a.length,
        b.length
    );

    return out;
}

/**
 * Returns the indices that would sort a vector in ascending order.
 *
 * @param a - Input vector (not mutated).
 * @returns A new Uint32Array of indices such that `a[out[i]]` is in
 * ascending order.
 */
export function argsort(
    a: Float32Array
): Uint32Array {
    const out = new Uint32Array(a.length);

    nativeVector.symbols.rk_vector_argsort_f32(
        ptr(a),
        ptr(out),
        a.length
    );

    return out;
}
