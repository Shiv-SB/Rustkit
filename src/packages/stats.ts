import { nativeStats, ptr } from "../native";

export function mean(a: Float32Array): number {
    if (a.length === 0) {
        throw new Error("Array must not be empty");
    }

    return nativeStats.symbols.rk_stats_mean_f32(ptr(a), a.length);
}

export function median(a: Float32Array): number {
    if (a.length === 0) {
        throw new Error("Array must not be empty");
    }

    return nativeStats.symbols.rk_stats_median_f32(ptr(a), a.length);
}

export function variance(a: Float32Array): number {
    if (a.length === 0) {
        throw new Error("Array must not be empty");
    }

    return nativeStats.symbols.rk_stats_variance_f32(ptr(a), a.length);
}

export function stddev(a: Float32Array): number {
    if (a.length === 0) {
        throw new Error("Array must not be empty");
    }

    return nativeStats.symbols.rk_stats_stddev_f32(ptr(a), a.length);
}

export function percentile(a: Float32Array, p: number): number {
    if (a.length === 0) {
        throw new Error("Array must not be empty");
    }
    if (p < 0 || p > 100) {
        throw new Error("Percentile must be between 0 and 100");
    }

    return nativeStats.symbols.rk_stats_percentile_f32(ptr(a), a.length, p);
}

export function covariance(a: Float32Array, b: Float32Array): number {
    if (a.length !== b.length) {
        throw new Error("Arrays must have the same length");
    }
    if (a.length === 0) {
        throw new Error("Arrays must not be empty");
    }

    return nativeStats.symbols.rk_stats_covariance_f32(ptr(a), ptr(b), a.length);
}

export function correlation(a: Float32Array, b: Float32Array): number {
    if (a.length !== b.length) {
        throw new Error("Arrays must have the same length");
    }
    if (a.length === 0) {
        throw new Error("Arrays must not be empty");
    }

    return nativeStats.symbols.rk_stats_correlation_f32(ptr(a), ptr(b), a.length);
}

export function zscore(a: Float32Array): Float32Array {
    if (a.length === 0) {
        throw new Error("Array must not be empty");
    }

    const out = new Float32Array(a);

    nativeStats.symbols.rk_stats_zscore_f32(ptr(out), a.length);

    return out;
}

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

export function quantile(a: Float32Array, q: number): number {
    if (a.length === 0) {
        throw new Error("Array must not be empty");
    }
    if (q < 0 || q > 1) {
        throw new Error("Quantile must be between 0 and 1");
    }

    return nativeStats.symbols.rk_stats_quantile_f32(ptr(a), a.length, q);
}
