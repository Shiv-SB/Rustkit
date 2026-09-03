import { describe, test, expect } from "bun:test";
import { distance } from "../src/index";

describe("distance.euclidean", () => {
    test("should compute Euclidean distance", () => {
        expect(distance.euclidean(new Float32Array([0, 0]), new Float32Array([3, 4]))).toBe(5);
    });

    test("should return 0 for identical vectors", () => {
        expect(distance.euclidean(new Float32Array([1, 2, 3]), new Float32Array([1, 2, 3]))).toBe(0);
    });

    test("should handle single element", () => {
        expect(distance.euclidean(new Float32Array([3]), new Float32Array([7]))).toBe(4);
    });

    test("should throw on mismatched lengths", () => {
        expect(() => distance.euclidean(new Float32Array([1, 2]), new Float32Array([1]))).toThrowError("Vectors must have the same length");
    });
});

describe("distance.manhattan", () => {
    test("should compute Manhattan distance", () => {
        expect(distance.manhattan(new Float32Array([0, 0]), new Float32Array([3, 4]))).toBe(7);
    });

    test("should return 0 for identical vectors", () => {
        expect(distance.manhattan(new Float32Array([5, 5]), new Float32Array([5, 5]))).toBe(0);
    });

    test("should handle negative values", () => {
        expect(distance.manhattan(new Float32Array([-1, -2]), new Float32Array([2, 1]))).toBe(6);
    });

    test("should throw on mismatched lengths", () => {
        expect(() => distance.manhattan(new Float32Array([1]), new Float32Array([1, 2]))).toThrowError("Vectors must have the same length");
    });
});

describe("distance.cosineSimilarity", () => {
    test("should return 1 for identical vectors", () => {
        expect(distance.cosineSimilarity(new Float32Array([1, 2, 3]), new Float32Array([1, 2, 3]))).toBeCloseTo(1, 4);
    });

    test("should return 1 for scaled vectors", () => {
        expect(distance.cosineSimilarity(new Float32Array([1, 0]), new Float32Array([5, 0]))).toBeCloseTo(1, 4);
    });

    test("should return 0 for orthogonal vectors", () => {
        expect(distance.cosineSimilarity(new Float32Array([1, 0]), new Float32Array([0, 1]))).toBeCloseTo(0, 4);
    });

    test("should throw on mismatched lengths", () => {
        expect(() => distance.cosineSimilarity(new Float32Array([1, 2]), new Float32Array([1]))).toThrowError("Vectors must have the same length");
    });
});

describe("distance.hammingDistance", () => {
    test("should count differing positions", () => {
        expect(distance.hammingDistance(new Int32Array([1, 2, 3, 4]), new Int32Array([1, 0, 3, 0]))).toBe(2);
    });

    test("should return 0 for identical vectors", () => {
        expect(distance.hammingDistance(new Int32Array([1, 2, 3]), new Int32Array([1, 2, 3]))).toBe(0);
    });

    test("should handle single element", () => {
        expect(distance.hammingDistance(new Int32Array([5]), new Int32Array([5]))).toBe(0);
    });

    test("should throw on mismatched lengths", () => {
        expect(() => distance.hammingDistance(new Int32Array([1, 2]), new Int32Array([1]))).toThrowError("Vectors must have the same length");
    });
});

describe("distance.jaccardSimilarity", () => {
    test("should return 1 for identical sets", () => {
        expect(distance.jaccardSimilarity(new Int32Array([1, 2, 3]), new Int32Array([1, 2, 3]))).toBe(1);
    });

    test("should return 0 for disjoint sets", () => {
        expect(distance.jaccardSimilarity(new Int32Array([1, 2]), new Int32Array([3, 4]))).toBe(0);
    });

    test("should compute partial overlap", () => {
        const result = distance.jaccardSimilarity(new Int32Array([1, 2, 3]), new Int32Array([2, 3, 4]));
        expect(result).toBe(0.5); // intersection=2, union=4
    });
});

describe("distance.chebyshev", () => {
    test("should compute max absolute difference", () => {
        expect(distance.chebyshev(new Float32Array([1, 2, 3]), new Float32Array([4, 6, 8]))).toBe(5);
    });

    test("should return 0 for identical vectors", () => {
        expect(distance.chebyshev(new Float32Array([5, 5]), new Float32Array([5, 5]))).toBe(0);
    });

    test("should throw on mismatched lengths", () => {
        expect(() => distance.chebyshev(new Float32Array([1]), new Float32Array([1, 2]))).toThrowError("Vectors must have the same length");
    });
});
