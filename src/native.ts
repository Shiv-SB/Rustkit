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
    rk_vector_fill_f32: {
        args: ["ptr", "float", "u64"],
        returns: "void",
    },
    rk_vector_zero_f32: {
        args: ["ptr", "u64"],
        returns: "void",
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
    rk_matrix_reshape: {
        args: ["ptr", "ptr", "u64", "u64"],
        returns: "void",
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
});

const nativeSort = dlopen(LIB, {
    rk_sort_quicksort_i32: {
        args: ["ptr", "u64"],
        returns: "void",
    },
    rk_sort_argsort_f32: {
        args: ["ptr", "ptr", "u64"],
        returns: "void",
    },
    rk_sort_is_sorted_i32: {
        args: ["ptr", "u64"],
        returns: "bool",
    },
    rk_sort_select_kth_i32: {
        args: ["ptr", "u64", "u64"],
        returns: "i32",
    },
});

const nativeSearch = dlopen(LIB, {
    rk_search_binary_search_i32: {
        args: ["ptr", "u64", "i32", "ptr"],
        returns: "bool",
    },
    rk_search_lower_bound_i32: {
        args: ["ptr", "u64", "i32"],
        returns: "u64",
    },
    rk_search_upper_bound_i32: {
        args: ["ptr", "u64", "i32"],
        returns: "u64",
    },
    rk_search_linear_search_i32: {
        args: ["ptr", "u64", "i32", "ptr"],
        returns: "bool",
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
    rk_crypto_aead_encrypt: {
        args: ["ptr", "ptr", "ptr", "u64", "ptr", "u64", "ptr"],
        returns: "u64",
    },
    rk_crypto_aead_decrypt: {
        args: ["ptr", "ptr", "ptr", "u64", "ptr", "u64", "ptr"],
        returns: "bool",
    },
    rk_crypto_chacha20: {
        args: ["ptr", "ptr", "u32", "ptr", "u64", "ptr"],
        returns: "void",
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
});

export {
    nativeVector,
    nativeMatrix,
    nativeStats,
    nativeSort,
    nativeSearch,
    nativeBitset,
    nativeString,
    nativeGeohash,
    nativeCrypto,
    nativeQuantile,
    ptr,
};
