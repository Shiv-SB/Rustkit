import { nativeQuantize, ptr } from "../native";

/**
 * Quantizes a vector to INT8 using symmetric quantization.
 *
 * @param a - Input vector.
 * @returns The quantized values and the scale factor such that
 * `dequantizeInt8(quantized, scale)` approximates `a`.
 */
export function quantizeInt8(
    a: Float32Array
): { quantized: Int8Array; scale: number } {
    if (a.length === 0) {
        throw new Error("Vector must not be empty");
    }

    const out = new Int8Array(a.length);

    const scale = nativeQuantize.symbols.rk_quantize_quantize_int8_f32(
        ptr(a),
        ptr(out),
        a.length
    );

    return { quantized: out, scale };
}

/**
 * Dequantizes an INT8 vector back to f32 using the given scale.
 *
 * @param quantized - Quantized values.
 * @param scale - Scale factor from `quantizeInt8`.
 * @returns A new Float32Array where each element is
 * `quantized[i] * scale`.
 */
export function dequantizeInt8(
    quantized: Int8Array,
    scale: number
): Float32Array {
    if (quantized.length === 0) {
        throw new Error("Vector must not be empty");
    }

    const out = new Float32Array(quantized.length);

    nativeQuantize.symbols.rk_quantize_dequantize_int8_f32(
        ptr(quantized),
        scale,
        ptr(out),
        out.length
    );

    return out;
}

/**
 * Quantizes a vector to INT4 using symmetric quantization, packing
 * two 4-bit values per byte.
 *
 * @param a - Input vector.
 * @returns The packed quantized bytes (length `ceil(a.length / 2)`)
 * and the scale factor.
 */
export function quantizeInt4(
    a: Float32Array
): { quantized: Uint8Array; scale: number } {
    if (a.length === 0) {
        throw new Error("Vector must not be empty");
    }

    const out = new Uint8Array(Math.ceil(a.length / 2));

    const scale = nativeQuantize.symbols.rk_quantize_quantize_int4_f32(
        ptr(a),
        ptr(out),
        a.length
    );

    return { quantized: out, scale };
}

/**
 * Dequantizes a packed INT4 vector back to f32 using the given scale.
 *
 * @param quantized - Packed quantized bytes (two 4-bit values per byte).
 * @param scale - Scale factor from `quantizeInt4`.
 * @param length - Number of elements in the original (unpacked) vector.
 * @returns A new Float32Array of length `length` containing the
 * dequantized values.
 * @throws {Error} If `length` is not a non-negative integer or
 * `quantized` has fewer than `ceil(length / 2)` bytes.
 */
export function dequantizeInt4(
    quantized: Uint8Array,
    scale: number,
    length: number
): Float32Array {
    if (!Number.isInteger(length) || length < 0) {
        throw new Error("length must be a non-negative integer");
    }
    if (quantized.length < Math.ceil(length / 2)) {
        throw new Error("quantized must have at least ceil(length / 2) bytes");
    }

    const out = new Float32Array(length);

    nativeQuantize.symbols.rk_quantize_dequantize_int4_f32(
        ptr(quantized),
        quantized.length,
        scale,
        ptr(out),
        out.length
    );

    return out;
}
