import { describe, test, expect } from "bun:test";
import { quantize } from "../src/index";

describe("quantize.quantizeInt8", () => {
    test("should return quantized array and scale", () => {
        const result = quantize.quantizeInt8(new Float32Array([0.5, -0.5, 1.0, -1.0]));
        expect(result.quantized).toBeInstanceOf(Int8Array);
        expect(result.quantized.length).toBe(4);
        expect(typeof result.scale).toBe("number");
    });

    test("should handle single element", () => {
        const result = quantize.quantizeInt8(new Float32Array([42]));
        expect(result.quantized.length).toBe(1);
        expect(result.scale).toBeGreaterThan(0);
    });

    test("should throw on empty input", () => {
        expect(() => quantize.quantizeInt8(new Float32Array([]))).toThrow("Vector must not be empty");
    });
});

describe("quantize.dequantizeInt8", () => {
    test("should return Float32Array of same length", () => {
        const result = quantize.dequantizeInt8(new Int8Array([64, -64, 127, -127]), 0.01);
        expect(result).toBeInstanceOf(Float32Array);
        expect(result.length).toBe(4);
    });

    test("should approximately round-trip with quantizeInt8", () => {
        const original = new Float32Array([0.5, -0.3, 0.8, -0.1]);
        const { quantized, scale } = quantize.quantizeInt8(original);
        const recovered = quantize.dequantizeInt8(quantized, scale);
        for (let i = 0; i < original.length; i++) {
            expect(recovered[i]!).toBeCloseTo(original[i]!, 1);
        }
    });

    test("should throw on empty input", () => {
        expect(() => quantize.dequantizeInt8(new Int8Array([]), 0.01)).toThrow("Vector must not be empty");
    });
});

describe("quantize.quantizeInt4", () => {
    test("should return packed bytes and scale", () => {
        const result = quantize.quantizeInt4(new Float32Array([0.5, -0.5, 1.0, -1.0]));
        expect(result.quantized).toBeInstanceOf(Uint8Array);
        expect(result.quantized.length).toBe(2); // ceil(4/2)
        expect(typeof result.scale).toBe("number");
    });

    test("should handle odd length", () => {
        const result = quantize.quantizeInt4(new Float32Array([0.1, 0.2, 0.3]));
        expect(result.quantized.length).toBe(2); // ceil(3/2)
    });

    test("should handle single element", () => {
        const result = quantize.quantizeInt4(new Float32Array([1.0]));
        expect(result.quantized.length).toBe(1);
    });

    test("should throw on empty input", () => {
        expect(() => quantize.quantizeInt4(new Float32Array([]))).toThrow("Vector must not be empty");
    });
});

describe("quantize.dequantizeInt4", () => {
    test("should return Float32Array of specified length", () => {
        const result = quantize.dequantizeInt4(new Uint8Array([0xAB, 0xCD]), 0.1, 4);
        expect(result).toBeInstanceOf(Float32Array);
        expect(result.length).toBe(4);
    });

    test("should throw on negative length", () => {
        expect(() => quantize.dequantizeInt4(new Uint8Array([0]), 0.1, -1)).toThrow("length must be a non-negative integer");
    });

    test("should throw on insufficient bytes", () => {
        expect(() => quantize.dequantizeInt4(new Uint8Array([0]), 0.1, 4)).toThrow("quantized must have at least ceil(length / 2) bytes");
    });

    test("should approximately round-trip with quantizeInt4", () => {
        const original = new Float32Array([0.5, -0.3, 0.8, -0.1]);
        const { quantized, scale } = quantize.quantizeInt4(original);
        const recovered = quantize.dequantizeInt4(quantized, scale, original.length);
        for (let i = 0; i < original.length; i++) {
            expect(recovered[i]!).toBeCloseTo(original[i]!, 0);
        }
    });
});
