import { nativeStats, ptr } from "../native";

/**
 * Computes the arithmetic mean of a vector.
 *
 * @param a - Input vector.
 * @returns The mean `sum(a) / a.length`.
 * @throws {Error} If `a` is empty.
 */
export function mean(a: Float32Array): number {
    if (a.length === 0) {
        throw new Error("Array must not be empty");
    }

    return nativeStats.symbols.rk_stats_mean_f32(ptr(a), a.length);
}

/**
 * Computes the median of a vector.
 *
 * For even-length inputs, the median is the average of the two middle
 * values of the sorted data.
 *
 * @param a - Input vector.
 * @returns The median value.
 * @throws {Error} If `a` is empty.
 */
export function median(a: Float32Array): number {
    if (a.length === 0) {
        throw new Error("Array must not be empty");
    }

    return nativeStats.symbols.rk_stats_median_f32(ptr(a), a.length);
}

/**
 * Computes the population variance of a vector.
 *
 * @param a - Input vector.
 * @returns The variance `sum((a[i] - mean)^2) / a.length`.
 * @throws {Error} If `a` is empty.
 */
export function variance(a: Float32Array): number {
    if (a.length === 0) {
        throw new Error("Array must not be empty");
    }

    return nativeStats.symbols.rk_stats_variance_f32(ptr(a), a.length);
}

/**
 * Computes the population standard deviation of a vector.
 *
 * @param a - Input vector.
 * @returns The standard deviation `sqrt(variance(a))`.
 * @throws {Error} If `a` is empty.
 */
export function stddev(a: Float32Array): number {
    if (a.length === 0) {
        throw new Error("Array must not be empty");
    }

    return nativeStats.symbols.rk_stats_stddev_f32(ptr(a), a.length);
}

/**
 * Computes the `p`-th percentile of a vector using linear interpolation
 * between sorted values.
 *
 * @param a - Input vector.
 * @param p - Percentile in `[0, 100]`.
 * @returns The interpolated percentile value.
 * @throws {Error} If `a` is empty or `p` is outside `[0, 100]`.
 */
export function percentile(a: Float32Array, p: number): number {
    if (a.length === 0) {
        throw new Error("Array must not be empty");
    }
    if (p < 0 || p > 100) {
        throw new Error("Percentile must be between 0 and 100");
    }

    return nativeStats.symbols.rk_stats_percentile_f32(ptr(a), a.length, p);
}

/**
 * Computes the population covariance between two vectors.
 *
 * @param a - First input vector.
 * @param b - Second input vector.
 * @returns The covariance `sum((a[i] - mean(a)) * (b[i] - mean(b))) / n`.
 * @throws {Error} If `a` and `b` have different lengths or are empty.
 */
export function covariance(a: Float32Array, b: Float32Array): number {
    if (a.length !== b.length) {
        throw new Error("Arrays must have the same length");
    }
    if (a.length === 0) {
        throw new Error("Arrays must not be empty");
    }

    return nativeStats.symbols.rk_stats_covariance_f32(ptr(a), ptr(b), a.length);
}

/**
 * Computes the Pearson correlation coefficient between two vectors.
 *
 * @param a - First input vector.
 * @param b - Second input vector.
 * @returns The correlation coefficient in `[-1, 1]` (0 if either input
 * has zero standard deviation).
 * @throws {Error} If `a` and `b` have different lengths or are empty.
 */
export function correlation(a: Float32Array, b: Float32Array): number {
    if (a.length !== b.length) {
        throw new Error("Arrays must have the same length");
    }
    if (a.length === 0) {
        throw new Error("Arrays must not be empty");
    }

    return nativeStats.symbols.rk_stats_correlation_f32(ptr(a), ptr(b), a.length);
}

/**
 * Computes the z-scores of a vector: `(a[i] - mean) / stddev`.
 *
 * @param a - Input vector (not mutated).
 * @returns A new Float32Array of standardized values.
 * @throws {Error} If `a` is empty.
 */
export function zscore(a: Float32Array): Float32Array {
    if (a.length === 0) {
        throw new Error("Array must not be empty");
    }

    const out = new Float32Array(a);

    nativeStats.symbols.rk_stats_zscore_f32(ptr(out), a.length);

    return out;
}

/**
 * Computes a histogram of the input values over `bins` evenly spaced
 * buckets spanning the data range.
 *
 * @param a - Input vector.
 * @param bins - Number of buckets, a positive integer.
 * @returns A new Uint32Array of length `bins` with the per-bucket counts.
 * @throws {Error} If `a` is empty or `bins` is 0.
 */
export function histogram(a: Float32Array, bins: number): Uint32Array {
    if (a.length === 0) {
        throw new Error("Array must not be empty");
    }
    if (bins === 0) {
        throw new Error("Bins must be greater than 0");
    }

    const out = new Uint32Array(bins);

    nativeStats.symbols.rk_stats_histogram_f32(ptr(a), a.length, bins, ptr(out));

    return out;
}

/**
 * Computes the `q`-th quantile of a vector using linear interpolation
 * between sorted values.
 *
 * @param a - Input vector.
 * @param q - Quantile in `[0, 1]`.
 * @returns The interpolated quantile value.
 * @throws {Error} If `a` is empty or `q` is outside `[0, 1]`.
 */
export function quantile(a: Float32Array, q: number): number {
    if (a.length === 0) {
        throw new Error("Array must not be empty");
    }
    if (q < 0 || q > 1) {
        throw new Error("Quantile must be between 0 and 1");
    }

    return nativeStats.symbols.rk_stats_quantile_f32(ptr(a), a.length, q);
}

/**
 * Returns the most frequent value in a vector.
 *
 * @param a - Input vector.
 * @returns The mode (most common value).
 * @throws {Error} If `a` is empty.
 */
export function mode(a: Float32Array): number {
    if (a.length === 0) {
        throw new Error("Array must not be empty");
    }

    return nativeStats.symbols.rk_stats_mode_f32(ptr(a), a.length);
}

/**
 * Computes the skewness of a vector: the third standardized moment.
 *
 * @param a - Input vector.
 * @returns The skewness (0 if `a` has zero standard deviation).
 * @throws {Error} If `a` is empty.
 */
export function skewness(a: Float32Array): number {
    if (a.length === 0) {
        throw new Error("Array must not be empty");
    }

    return nativeStats.symbols.rk_stats_skewness_f32(ptr(a), a.length);
}

/**
 * Computes the excess kurtosis of a vector: the fourth standardized
 * moment minus 3.
 *
 * @param a - Input vector.
 * @returns The excess kurtosis (0 if `a` has zero standard deviation).
 * @throws {Error} If `a` is empty.
 */
export function kurtosis(a: Float32Array): number {
    if (a.length === 0) {
        throw new Error("Array must not be empty");
    }

    return nativeStats.symbols.rk_stats_kurtosis_f32(ptr(a), a.length);
}

/**
 * Computes the geometric mean of a vector: `exp(mean(ln(a[i])))`.
 *
 * @param a - Input vector of positive values.
 * @returns The geometric mean.
 * @throws {Error} If `a` is empty.
 */
export function geometricMean(a: Float32Array): number {
    if (a.length === 0) {
        throw new Error("Array must not be empty");
    }

    return nativeStats.symbols.rk_stats_geometric_mean_f32(ptr(a), a.length);
}

/**
 * Computes the weighted mean of a vector.
 *
 * @param a - Input values.
 * @param weights - Per-element weights (same length as `a`).
 * @returns The weighted mean `sum(a[i] * weights[i]) / sum(weights)`.
 * @throws {Error} If `a` and `weights` have different lengths, are empty,
 * or the weights do not sum to a positive value.
 */
export function weightedMean(a: Float32Array, weights: Float32Array): number {
    if (a.length !== weights.length) {
        throw new Error("Arrays must have the same length");
    }
    if (a.length === 0) {
        throw new Error("Arrays must not be empty");
    }

    const totalWeight = weights.reduce((s, w) => s + w, 0);
    if (totalWeight <= 0) {
        throw new Error("Weights must sum to a positive value");
    }

    return nativeStats.symbols.rk_stats_weighted_mean_f32(ptr(a), ptr(weights), a.length);
}

/**
 * Computes the interquartile range (IQR) of a vector: `Q3 - Q1`.
 *
 * @param a - Input vector.
 * @returns The IQR, i.e. the 75th percentile minus the 25th percentile.
 * @throws {Error} If `a` is empty.
 */
export function iqr(a: Float32Array): number {
    if (a.length === 0) {
        throw new Error("Array must not be empty");
    }

    return nativeStats.symbols.rk_stats_iqr_f32(ptr(a), a.length);
}
