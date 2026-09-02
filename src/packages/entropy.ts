import { nativeEntropy, ptr } from "../native";

/**
 * Computes the Shannon entropy of a probability distribution.
 *
 * @param a - Probability distribution (values that sum to 1).
 * @returns The entropy `-sum(a[i] * log2(a[i]))` in bits.
 */
export function shannonEntropy(
    a: Float32Array
): number {
    return nativeEntropy.symbols.rk_entropy_shannon_entropy_f32(
        ptr(a),
        a.length
    );
}

/**
 * Computes the cross entropy between two probability distributions.
 *
 * @param a - True probability distribution.
 * @param b - Approximating probability distribution.
 * @returns The cross entropy `-sum(a[i] * log2(b[i]))` in bits.
 * @throws {Error} If `a` and `b` have different lengths.
 */
export function crossEntropy(
    a: Float32Array,
    b: Float32Array
): number {
    if (a.length !== b.length) {
        throw new Error("Vectors must have the same length");
    }

    return nativeEntropy.symbols.rk_entropy_cross_entropy_f32(
        ptr(a),
        ptr(b),
        a.length
    );
}

/**
 * Computes the Kullback-Leibler divergence between two probability
 * distributions.
 *
 * @param a - True probability distribution.
 * @param b - Approximating probability distribution.
 * @returns The KL divergence `sum(a[i] * log2(a[i] / b[i]))` in bits.
 * @throws {Error} If `a` and `b` have different lengths.
 */
export function klDivergence(
    a: Float32Array,
    b: Float32Array
): number {
    if (a.length !== b.length) {
        throw new Error("Vectors must have the same length");
    }

    return nativeEntropy.symbols.rk_entropy_kl_divergence_f32(
        ptr(a),
        ptr(b),
        a.length
    );
}

/**
 * Computes the mutual information between two variables from their
 * joint and marginal distributions.
 *
 * @param joint - Flattened joint distribution of length `rows * cols`
 * (row-major).
 * @param marginalX - Marginal distribution of X (length `rows`).
 * @param marginalY - Marginal distribution of Y (length `cols`).
 * @param rows - Number of rows in the joint distribution.
 * @param cols - Number of columns in the joint distribution.
 * @returns The mutual information `I(X; Y)` in bits.
 * @throws {Error} If any length does not match `rows` / `cols`.
 */
export function mutualInformation(
    joint: Float32Array,
    marginalX: Float32Array,
    marginalY: Float32Array,
    rows: number,
    cols: number
): number {
    if (!Number.isInteger(rows) || rows < 0 || !Number.isInteger(cols) || cols < 0) {
        throw new Error("rows and cols must be non-negative integers");
    }
    if (joint.length !== rows * cols) {
        throw new Error("joint must have length rows * cols");
    }
    if (marginalX.length !== rows) {
        throw new Error("marginalX must have length rows");
    }
    if (marginalY.length !== cols) {
        throw new Error("marginalY must have length cols");
    }

    return nativeEntropy.symbols.rk_entropy_mutual_information_f32(
        ptr(joint),
        ptr(marginalX),
        ptr(marginalY),
        rows,
        cols
    );
}
