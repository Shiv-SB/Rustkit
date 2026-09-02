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
 * Creates a new vector filled with a constant value.
 *
 * @param len - Length of the output vector.
 * @param val - Value to fill each element with.
 * @returns A new Float32Array of length `len` where every element is `val`.
 */
export function fill(
    len: number,
    val: number
): Float32Array {
    if (len === 0) {
        return new Float32Array(0);
    }

    const out = new Float32Array(len);

    nativeVector.symbols.rk_vector_fill_f32(
        ptr(out),
        val,
        len
    );

    return out;
}

/**
 * Creates a new vector filled with zeros.
 *
 * @param len - Length of the output vector.
 * @returns A new Float32Array of length `len` initialized to `0`.
 */
export function zero(
    len: number
): Float32Array {
    if (len === 0) {
        return new Float32Array(0);
    }

    const out = new Float32Array(len);

    nativeVector.symbols.rk_vector_zero_f32(
        ptr(out),
        len
    );

    return out;
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
 * Sorts a vector in ascending order.
 *
 * @param a - Input vector (not mutated).
 * @returns A new Float32Array containing the sorted elements.
 */
export function sort(
    a: Float32Array
): Float32Array {
    const out = new Float32Array(a);

    nativeVector.symbols.rk_vector_sort_f32(
        ptr(out),
        out.length
    );

    return out;
}
