import { describe, test, expect } from "bun:test";
import { fft } from "../src/index";

describe("fft.fft", () => {
    test("should return real and imag arrays of same length", () => {
        const result = fft.fft(new Float32Array([1, 0, 0, 0]), new Float32Array([0, 0, 0, 0]));
        expect(result.real.length).toBe(4);
        expect(result.imag.length).toBe(4);
    });

    test("should not mutate input", () => {
        const real = new Float32Array([1, 2, 3, 4]);
        const imag = new Float32Array([0, 0, 0, 0]);
        fft.fft(real, imag);
        expect(real).toEqual(new Float32Array([1, 2, 3, 4]));
        expect(imag).toEqual(new Float32Array([0, 0, 0, 0]));
    });

    test("should throw on mismatched lengths", () => {
        expect(() => fft.fft(new Float32Array([1, 2]), new Float32Array([1]))).toThrow("Vectors must have the same length");
    });
});

describe("fft.ifft", () => {
    test("should return real and imag arrays of same length", () => {
        const result = fft.ifft(new Float32Array([1, 0, 0, 0]), new Float32Array([0, 0, 0, 0]));
        expect(result.real.length).toBe(4);
        expect(result.imag.length).toBe(4);
    });

    test("should not mutate input", () => {
        const real = new Float32Array([1, 2, 3, 4]);
        const imag = new Float32Array([5, 6, 7, 8]);
        fft.ifft(real, imag);
        expect(real).toEqual(new Float32Array([1, 2, 3, 4]));
    });

    test("should throw on mismatched lengths", () => {
        expect(() => fft.ifft(new Float32Array([1]), new Float32Array([1, 2]))).toThrow("Vectors must have the same length");
    });
});

describe("fft.rfft", () => {
    test("should return spectrum of length n/2+1", () => {
        const result = fft.rfft(new Float32Array([1, 2, 3, 4, 5, 6, 7, 8]));
        expect(result.real.length).toBe(5); // 8/2+1
        expect(result.imag.length).toBe(5);
    });

    test("should handle power-of-2 input", () => {
        const result = fft.rfft(new Float32Array([1, 0, 1, 0]));
        expect(result.real.length).toBe(3); // 4/2+1
        expect(result.imag.length).toBe(3);
    });

    test("should handle single element", () => {
        const result = fft.rfft(new Float32Array([42]));
        expect(result.real.length).toBe(1);
        expect(result.imag.length).toBe(1);
    });
});

describe("fft.irfft", () => {
    test("should reconstruct signal from spectrum", () => {
        const specReal = new Float32Array([1, 2, 3]);
        const specImag = new Float32Array([0, 1, 0]);
        const result = fft.irfft(specReal, specImag);
        expect(result.length).toBe(4); // 2*(3-1)
    });

    test("should throw on mismatched lengths", () => {
        expect(() => fft.irfft(new Float32Array([1, 2]), new Float32Array([1]))).toThrow("Vectors must have the same length");
    });

    test("should throw on empty input", () => {
        expect(() => fft.irfft(new Float32Array([]), new Float32Array([]))).toThrow("Vector must not be empty");
    });
});

describe("fft.convolve", () => {
    test("should return array of length a+b-1", () => {
        const result = fft.convolve(new Float32Array([1, 2, 3]), new Float32Array([4, 5]));
        expect(result.length).toBe(4); // 3+2-1
    });

    test("should return empty for empty input", () => {
        expect(fft.convolve(new Float32Array([]), new Float32Array([1, 2]))).toEqual(new Float32Array(0));
    });

    test("should handle single element signals", () => {
        const result = fft.convolve(new Float32Array([3]), new Float32Array([7]));
        expect(result.length).toBe(1);
    });
});

describe("fft.powerSpectrum", () => {
    test("should return array of length n/2+1", () => {
        const result = fft.powerSpectrum(new Float32Array([1, 2, 3, 4, 5, 6, 7, 8]));
        expect(result.length).toBe(5); // 8/2+1
    });

    test("should handle single element", () => {
        const result = fft.powerSpectrum(new Float32Array([42]));
        expect(result.length).toBe(1);
    });
});
