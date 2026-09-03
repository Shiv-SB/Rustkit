import { describe, test, expect } from "bun:test";
import { entropy } from "../src/index";

describe("entropy.shannonEntropy", () => {
    test("should return 0 for deterministic distribution", () => {
        expect(entropy.shannonEntropy(new Float32Array([1, 0, 0]))).toBeCloseTo(0, 1);
    }, { repeats: 100 });

    test("should return 1 for uniform binary distribution", () => {
        expect(entropy.shannonEntropy(new Float32Array([0.5, 0.5]))).toBe(1);
    }, { repeats: 100 });

    test("should return log2(n) for uniform distribution", () => {
        expect(entropy.shannonEntropy(new Float32Array([0.25, 0.25, 0.25, 0.25]))).toBe(2);
    }, { repeats: 100 });
});

describe("entropy.crossEntropy", () => {
    test("should equal Shannon entropy when distributions are identical", () => {
        const p = new Float32Array([0.5, 0.5]);
        const h = entropy.shannonEntropy(p);
        const ce = entropy.crossEntropy(p, p);
        expect(ce).toBe(h);
    });

    test("should be >= Shannon entropy", () => {
        const p = new Float32Array([0.5, 0.5]);
        const q = new Float32Array([0.9, 0.1]);
        expect(entropy.crossEntropy(p, q)).toBeGreaterThanOrEqual(entropy.shannonEntropy(p));
    });

    test("should throw on mismatched lengths", () => {
        expect(() => entropy.crossEntropy(new Float32Array([0.5, 0.5]), new Float32Array([1]))).toThrowError("Vectors must have the same length");
    });
});

describe("entropy.klDivergence", () => {
    test("should return 0 for identical distributions", () => {
        const p = new Float32Array([0.5, 0.5]);
        expect(entropy.klDivergence(p, p)).toBe(0);
    });

    test("should return positive value for different distributions", () => {
        const p = new Float32Array([0.5, 0.5]);
        const q = new Float32Array([0.9, 0.1]);
        expect(entropy.klDivergence(p, q)).toBeGreaterThan(0);
    });

    test("should throw on mismatched lengths", () => {
        expect(() => entropy.klDivergence(new Float32Array([0.5, 0.5]), new Float32Array([1]))).toThrowError("Vectors must have the same length");
    });
});

describe("entropy.mutualInformation", () => {
    test("should return 0 for independent variables", () => {
        // Independent: joint = outer product of marginals
        const joint = new Float32Array([0.25, 0.25, 0.25, 0.25]);
        const mx = new Float32Array([0.5, 0.5]);
        const my = new Float32Array([0.5, 0.5]);
        expect(entropy.mutualInformation(joint, mx, my, 2, 2)).toBe(0);
    });

    test("should throw on joint length mismatch", () => {
        expect(() => entropy.mutualInformation(new Float32Array([1]), new Float32Array([0.5]), new Float32Array([0.5]), 2, 2)).toThrowError("joint must have length rows * cols");
    });

    test("should throw on marginal length mismatch", () => {
        expect(() => entropy.mutualInformation(new Float32Array([0.25, 0.25, 0.25, 0.25]), new Float32Array([0.5]), new Float32Array([0.5, 0.5]), 2, 2)).toThrowError("marginalX must have length rows");
    });

    test("should throw on invalid rows/cols", () => {
        expect(() => entropy.mutualInformation(new Float32Array([]), new Float32Array([]), new Float32Array([]), -1, 0)).toThrowError("rows and cols must be non-negative integers");
    });
});
