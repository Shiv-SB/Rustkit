import { dlopen, ptr } from "bun:ffi";
import { join } from "node:path";
import { existsSync } from "node:fs";

function isMusl(): boolean {
    if (process.platform !== "linux") return false;
    const arch = process.arch === "x64" ? "x86_64" : process.arch === "arm64" ? "aarch64" : process.arch;
    return existsSync(`/lib/ld-musl-${arch}.so.1`);
}

/**
 * Returns the platform binary directory keys to try, in order, for the
 * given platform/arch/musl combination.
 *
 * On Linux, the preferred libc variant (per `musl`) is tried first, then
 * the other; on other platforms only `${platform}-${arch}` is returned.
 *
 * @param platform - Node.js platform name (e.g. "darwin", "linux").
 * @param arch - Node.js architecture name (e.g. "arm64", "x64").
 * @param musl - Whether the Linux target uses musl.
 * @returns The candidate platform keys in priority order.
 */
export function platformCandidates(platform: string, arch: string, musl: boolean): string[] {
    if (platform === "linux") {
        const first = musl ? "musl" : "gnu";
        return [`linux-${arch}-${first}`, `linux-${arch}-${first === "musl" ? "gnu" : "musl"}`];
    }
    return [`${platform}-${arch}`];
}

function resolveLibrary(): { path: string; platform: string } {
    const platform = process.platform;
    const arch = process.arch;
    const ext = platform === "darwin" ? "dylib" : "so";

    const candidates = platformCandidates(platform, arch, isMusl());

    for (const key of candidates) {
        const bundled = join(import.meta.dir, "..", "platforms", key, `librustkit_ffi.${ext}`);
        if (existsSync(bundled)) {
            return { path: bundled, platform: key };
        }
    }

    const dev = join(import.meta.dir, "..", "target", "release", `librustkit_ffi.${ext}`);
    if (existsSync(dev)) {
        return { path: dev, platform: `${platform}-${arch}` };
    }

    throw new Error(
        `rustkit: no binary for ${platform}-${arch}. Supported: darwin-arm64, darwin-x64, linux-x64-gnu, linux-arm64-gnu, linux-x64-musl, linux-arm64-musl`
    );
}

const resolved = resolveLibrary();
const LIB = resolved.path;

const resolvedPlatform = resolved.platform;
const resolvedBinaryPath = resolved.path;

const nativeVector = dlopen(LIB, {
    rk_vector_add_f32: {
        args: ["ptr", "ptr", "ptr", "u64"],
        returns: "void",
    },
    rk_vector_sub_f32: {
        args: ["ptr", "ptr", "ptr", "u64"],
        returns: "void",
    },
    rk_vector_mul_f32: {
        args: ["ptr", "ptr", "ptr", "u64"],
        returns: "void",
    },
    rk_vector_div_f32: {
        args: ["ptr", "ptr", "ptr", "u64"],
        returns: "void",
    },
    rk_vector_dot_f32: {
        args: ["ptr", "ptr", "u64"],
        returns: "float",
    },
    rk_vector_cross_f32: {
        args: ["ptr", "ptr", "ptr", "u64"],
        returns: "void",
    },
    rk_vector_norm_f32: {
        args: ["ptr", "u64"],
        returns: "float",
    },
    rk_vector_normalize_f32: {
        args: ["ptr", "ptr", "u64"],
        returns: "void",
    },
    rk_vector_scale_f32: {
        args: ["ptr", "float", "ptr", "u64"],
        returns: "void",
    },
    rk_vector_argmin_f32: {
        args: ["ptr", "u64"],
        returns: "u64",
    },
    rk_vector_argmax_f32: {
        args: ["ptr", "u64"],
        returns: "u64",
    },
    rk_vector_sum_f32: {
        args: ["ptr", "u64"],
        returns: "float",
    },
    rk_vector_mean_f32: {
        args: ["ptr", "u64"],
        returns: "float",
    },
    rk_vector_lerp_f32: {
        args: ["ptr", "ptr", "float", "ptr", "u64"],
        returns: "void",
    },
    rk_vector_clamp_f32: {
        args: ["ptr", "float", "float", "u64"],
        returns: "void",
    },
    rk_vector_abs_f32: {
        args: ["ptr", "ptr", "u64"],
        returns: "void",
    },
    rk_vector_min_f32: {
        args: ["ptr", "ptr", "ptr", "u64"],
        returns: "void",
    },
    rk_vector_max_f32: {
        args: ["ptr", "ptr", "ptr", "u64"],
        returns: "void",
    },
    rk_vector_sqrt_f32: {
        args: ["ptr", "ptr", "u64"],
        returns: "void",
    },
    rk_vector_reciprocal_f32: {
        args: ["ptr", "ptr", "u64"],
        returns: "void",
    },
    rk_vector_l1_norm_f32: {
        args: ["ptr", "u64"],
        returns: "float",
    },
    rk_vector_l_inf_norm_f32: {
        args: ["ptr", "u64"],
        returns: "float",
    },
    rk_vector_outer_f32: {
        args: ["ptr", "ptr", "ptr", "u64", "u64"],
        returns: "void",
    },
    rk_vector_argsort_f32: {
        args: ["ptr", "ptr", "u64"],
        returns: "void",
    },
    rk_vector_sort_f32: {
        args: ["ptr", "u64"],
        returns: "void",
    },
});

const nativeMatrix = dlopen(LIB, {
    rk_matrix_mul_f32: {
        args: ["ptr", "ptr", "ptr", "u64", "u64", "u64"],
        returns: "void",
    },
    rk_matrix_transpose_f32: {
        args: ["ptr", "ptr", "u64", "u64"],
        returns: "void",
    },
    rk_matrix_determinant_f32: {
        args: ["ptr", "u64"],
        returns: "float",
    },
    rk_matrix_inverse_f32: {
        args: ["ptr", "ptr", "u64"],
        returns: "bool",
    },
    rk_matrix_add_f32: {
        args: ["ptr", "ptr", "ptr", "u64", "u64"],
        returns: "void",
    },
    rk_matrix_sub_f32: {
        args: ["ptr", "ptr", "ptr", "u64", "u64"],
        returns: "void",
    },
    rk_matrix_trace_f32: {
        args: ["ptr", "u64"],
        returns: "float",
    },
    rk_matrix_eye_f32: {
        args: ["ptr", "u64"],
        returns: "void",
    },
    rk_matrix_scale_f32: {
        args: ["ptr", "float", "ptr", "u64", "u64"],
        returns: "void",
    },
    rk_matrix_hadamard_f32: {
        args: ["ptr", "ptr", "ptr", "u64", "u64"],
        returns: "void",
    },
    rk_matrix_frobenius_norm_f32: {
        args: ["ptr", "u64", "u64"],
        returns: "float",
    },
    rk_matrix_lu_decompose_f32: {
        args: ["ptr", "ptr", "ptr", "u64"],
        returns: "bool",
    },
    rk_matrix_cholesky_f32: {
        args: ["ptr", "ptr", "u64"],
        returns: "bool",
    },
    rk_matrix_eigenvalues_f32: {
        args: ["ptr", "ptr", "u64"],
        returns: "bool",
    },
});

const nativeStats = dlopen(LIB, {
    rk_stats_mean_f32: {
        args: ["ptr", "u64"],
        returns: "float",
    },
    rk_stats_median_f32: {
        args: ["ptr", "u64"],
        returns: "float",
    },
    rk_stats_variance_f32: {
        args: ["ptr", "u64"],
        returns: "float",
    },
    rk_stats_stddev_f32: {
        args: ["ptr", "u64"],
        returns: "float",
    },
    rk_stats_percentile_f32: {
        args: ["ptr", "u64", "float"],
        returns: "float",
    },
    rk_stats_covariance_f32: {
        args: ["ptr", "ptr", "u64"],
        returns: "float",
    },
    rk_stats_correlation_f32: {
        args: ["ptr", "ptr", "u64"],
        returns: "float",
    },
    rk_stats_zscore_f32: {
        args: ["ptr", "u64"],
        returns: "void",
    },
    rk_stats_histogram_f32: {
        args: ["ptr", "u64", "u64", "ptr"],
        returns: "void",
    },
    rk_stats_quantile_f32: {
        args: ["ptr", "u64", "float"],
        returns: "float",
    },
    rk_stats_mode_f32: {
        args: ["ptr", "u64"],
        returns: "float",
    },
    rk_stats_skewness_f32: {
        args: ["ptr", "u64"],
        returns: "float",
    },
    rk_stats_kurtosis_f32: {
        args: ["ptr", "u64"],
        returns: "float",
    },
    rk_stats_geometric_mean_f32: {
        args: ["ptr", "u64"],
        returns: "float",
    },
    rk_stats_weighted_mean_f32: {
        args: ["ptr", "ptr", "u64"],
        returns: "float",
    },
    rk_stats_iqr_f32: {
        args: ["ptr", "u64"],
        returns: "float",
    },
});

const nativeBitset = dlopen(LIB, {
    rk_bitset_new: {
        args: ["ptr", "u64"],
        returns: "void",
    },
    rk_bitset_set: {
        args: ["ptr", "u64", "u64"],
        returns: "void",
    },
    rk_bitset_clear: {
        args: ["ptr", "u64", "u64"],
        returns: "void",
    },
    rk_bitset_toggle: {
        args: ["ptr", "u64", "u64"],
        returns: "void",
    },
    rk_bitset_popcount: {
        args: ["ptr", "u64"],
        returns: "u32",
    },
    rk_bitset_and: {
        args: ["ptr", "ptr", "ptr", "u64"],
        returns: "void",
    },
    rk_bitset_or: {
        args: ["ptr", "ptr", "ptr", "u64"],
        returns: "void",
    },
    rk_bitset_xor: {
        args: ["ptr", "ptr", "ptr", "u64"],
        returns: "void",
    },
    rk_bitset_next_set_bit: {
        args: ["ptr", "u64", "u64", "ptr"],
        returns: "bool",
    },
    rk_bitset_cardinality: {
        args: ["ptr", "u64"],
        returns: "u64",
    },
});

const nativeString = dlopen(LIB, {
    rk_string_levenshtein: {
        args: ["ptr", "u64", "ptr", "u64"],
        returns: "u64",
    },
    rk_string_hamming: {
        args: ["ptr", "u64", "ptr", "u64"],
        returns: "u64",
    },
    rk_string_fuzzy_match: {
        args: ["ptr", "u64", "ptr", "u64", "ptr"],
        returns: "bool",
    },
    rk_string_longest_common_subseq: {
        args: ["ptr", "u64", "ptr", "u64"],
        returns: "u64",
    },
    rk_string_longest_common_substr: {
        args: ["ptr", "u64", "ptr", "u64"],
        returns: "u64",
    },
    rk_string_damerau_levenshtein: {
        args: ["ptr", "u64", "ptr", "u64"],
        returns: "u64",
    },
    rk_string_jaro_winkler: {
        args: ["ptr", "u64", "ptr", "u64"],
        returns: "float",
    },
    rk_string_trigram_similarity: {
        args: ["ptr", "u64", "ptr", "u64"],
        returns: "float",
    },
    rk_string_soundex: {
        args: ["ptr", "u64", "ptr"],
        returns: "void",
    },
});

const nativeGeohash = dlopen(LIB, {
    rk_geohash_encode: {
        args: ["f64", "f64", "u64", "ptr"],
        returns: "void",
    },
    rk_geohash_decode: {
        args: ["ptr", "u64", "ptr", "ptr"],
        returns: "void",
    },
    rk_geohash_neighbor: {
        args: ["ptr", "u64", "i32", "ptr"],
        returns: "void",
    },
    rk_geohash_distance: {
        args: ["f64", "f64", "f64", "f64"],
        returns: "f64",
    },
    rk_geohash_is_valid: {
        args: ["ptr", "u64"],
        returns: "bool",
    },
    rk_geohash_all_neighbors: {
        args: ["ptr", "u64", "ptr"],
        returns: "void",
    },
    rk_geohash_bbox: {
        args: ["ptr", "u64", "ptr", "ptr", "ptr", "ptr"],
        returns: "void",
    },
});

const nativeCrypto = dlopen(LIB, {
    rk_crypto_crc32: {
        args: ["ptr", "u64"],
        returns: "u32",
    },
    rk_crypto_xxhash64: {
        args: ["ptr", "u64", "u64"],
        returns: "u64",
    },
    rk_crypto_fnv1a: {
        args: ["ptr", "u64"],
        returns: "u64",
    },
    rk_crypto_blake3: {
        args: ["ptr", "u64", "ptr"],
        returns: "void",
    },
    rk_crypto_murmur3: {
        args: ["ptr", "u64", "u32"],
        returns: "u32",
    },
});

const nativeQuantile = dlopen(LIB, {
    rk_quantile_t_digest_add: {
        args: ["ptr", "ptr", "u64", "u64", "float"],
        returns: "u64",
    },
    rk_quantile_t_digest_quantile: {
        args: ["ptr", "ptr", "u64", "float"],
        returns: "float",
    },
    rk_quantile_count_min_sketch_add: {
        args: ["ptr", "u64", "u64", "ptr", "u64"],
        returns: "void",
    },
    rk_quantile_bloom_filter_insert: {
        args: ["ptr", "u64", "ptr", "u64", "u64"],
        returns: "void",
    },
    rk_quantile_count_min_sketch_query: {
        args: ["ptr", "u64", "u64", "ptr", "u64"],
        returns: "u32",
    },
    rk_quantile_bloom_filter_contains: {
        args: ["ptr", "u64", "ptr", "u64", "u64"],
        returns: "bool",
    },
    rk_quantile_hyperloglog_create: {
        args: ["u64", "ptr", "u64"],
        returns: "void",
    },
    rk_quantile_hyperloglog_add: {
        args: ["ptr", "u64", "ptr", "u64"],
        returns: "void",
    },
    rk_quantile_hyperloglog_estimate: {
        args: ["ptr", "u64"],
        returns: "f64",
    },
    rk_quantile_minhash_create: {
        args: ["u64", "ptr", "u64"],
        returns: "void",
    },
    rk_quantile_minhash_add: {
        args: ["ptr", "u64", "ptr", "u64"],
        returns: "void",
    },
    rk_quantile_minhash_similarity: {
        args: ["ptr", "u64", "ptr", "u64"],
        returns: "float",
    },
});

const nativeDistance = dlopen(LIB, {
    rk_distance_euclidean_f32: {
        args: ["ptr", "ptr", "u64"],
        returns: "float",
    },
    rk_distance_manhattan_f32: {
        args: ["ptr", "ptr", "u64"],
        returns: "float",
    },
    rk_distance_cosine_similarity_f32: {
        args: ["ptr", "ptr", "u64"],
        returns: "float",
    },
    rk_distance_hamming_distance_i32: {
        args: ["ptr", "ptr", "u64"],
        returns: "u64",
    },
    rk_distance_jaccard_similarity_i32: {
        args: ["ptr", "u64", "ptr", "u64"],
        returns: "float",
    },
    rk_distance_chebyshev_f32: {
        args: ["ptr", "ptr", "u64"],
        returns: "float",
    },
});

const nativeFft = dlopen(LIB, {
    rk_fft_fft_f32: {
        args: ["ptr", "ptr", "u64"],
        returns: "void",
    },
    rk_fft_ifft_f32: {
        args: ["ptr", "ptr", "u64"],
        returns: "void",
    },
    rk_fft_rfft_f32: {
        args: ["ptr", "ptr", "ptr", "u64"],
        returns: "void",
    },
    rk_fft_irfft_f32: {
        args: ["ptr", "ptr", "ptr", "u64"],
        returns: "void",
    },
    rk_fft_convolve_f32: {
        args: ["ptr", "u64", "ptr", "u64", "ptr"],
        returns: "void",
    },
    rk_fft_power_spectrum_f32: {
        args: ["ptr", "ptr", "u64"],
        returns: "void",
    },
});

const nativeEntropy = dlopen(LIB, {
    rk_entropy_shannon_entropy_f32: {
        args: ["ptr", "u64"],
        returns: "float",
    },
    rk_entropy_cross_entropy_f32: {
        args: ["ptr", "ptr", "u64"],
        returns: "float",
    },
    rk_entropy_kl_divergence_f32: {
        args: ["ptr", "ptr", "u64"],
        returns: "float",
    },
    rk_entropy_mutual_information_f32: {
        args: ["ptr", "ptr", "ptr", "u64", "u64"],
        returns: "float",
    },
});

const nativeQuantize = dlopen(LIB, {
    rk_quantize_quantize_int8_f32: {
        args: ["ptr", "ptr", "u64"],
        returns: "float",
    },
    rk_quantize_dequantize_int8_f32: {
        args: ["ptr", "float", "ptr", "u64"],
        returns: "void",
    },
    rk_quantize_quantize_int4_f32: {
        args: ["ptr", "ptr", "u64"],
        returns: "float",
    },
    rk_quantize_dequantize_int4_f32: {
        args: ["ptr", "u64", "float", "ptr", "u64"],
        returns: "void",
    },
});

const nativeSampling = dlopen(LIB, {
    rk_sampling_softmax_f32: {
        args: ["ptr", "u64"],
        returns: "void",
    },
    rk_sampling_log_softmax_f32: {
        args: ["ptr", "u64"],
        returns: "void",
    },
    rk_sampling_temperature_f32: {
        args: ["ptr", "float", "u64"],
        returns: "void",
    },
    rk_sampling_top_k_f32: {
        args: ["ptr", "u64", "u64"],
        returns: "void",
    },
    rk_sampling_top_p_f32: {
        args: ["ptr", "float", "u64"],
        returns: "void",
    },
    rk_sampling_min_p_f32: {
        args: ["ptr", "float", "u64"],
        returns: "void",
    },
    rk_sampling_repetition_penalty_f32: {
        args: ["ptr", "u64", "float", "ptr", "u64"],
        returns: "void",
    },
    rk_sampling_categorical_f32: {
        args: ["ptr", "u64", "u64"],
        returns: "u64",
    },
    rk_sampling_greedy_f32: {
        args: ["ptr", "u64"],
        returns: "u64",
    },
});

const nativeEval = dlopen(LIB, {
    rk_eval_perplexity_f32: {
        args: ["ptr", "u64"],
        returns: "float",
    },
    rk_eval_bleu: {
        args: ["ptr", "u64", "ptr", "u64", "u64"],
        returns: "float",
    },
    rk_eval_rouge_l: {
        args: ["ptr", "u64", "ptr", "u64"],
        returns: "float",
    },
    rk_eval_token_f1_i32: {
        args: ["ptr", "u64", "ptr", "u64"],
        returns: "float",
    },
    rk_eval_exact_match: {
        args: ["ptr", "u64", "ptr", "u64"],
        returns: "bool",
    },
});

const nativeConfig = dlopen(LIB, {
    rk_config_version: {
        args: ["ptr", "u64"],
        returns: "void",
    },
    rk_config_simd: {
        args: [],
        returns: "u32",
    },
});

export {
    nativeVector,
    nativeMatrix,
    nativeStats,
    nativeBitset,
    nativeString,
    nativeGeohash,
    nativeCrypto,
    nativeQuantile,
    nativeDistance,
    nativeFft,
    nativeEntropy,
    nativeQuantize,
    nativeSampling,
    nativeEval,
    nativeConfig,
    resolvedPlatform,
    resolvedBinaryPath,
    ptr,
};
