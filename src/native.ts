import { dlopen, ptr, suffix } from "bun:ffi";

const LIB = `./target/release/librustkit_ffi.${suffix}`;

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
        args: ["ptr", "ptr", "ptr", "u64", "float"],
        returns: "void",
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
    ptr,
};
