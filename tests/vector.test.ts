import { describe, test, expect } from "bun:test";
import { vector } from "../src/index";

describe("vector.add", () => {
    test("should add two vectors element-wise", () => {
        const a = new Float32Array([1, 2, 3, 4]);
        const b = new Float32Array([10, 20, 30, 40]);
        expect(vector.add(a, b)).toEqual(new Float32Array([11, 22, 33, 44]));
    });

    test("should handle negative values", () => {
        const a = new Float32Array([-1, -2, -3]);
        const b = new Float32Array([1, 2, 3]);
        expect(vector.add(a, b)).toEqual(new Float32Array([0, 0, 0]));
    });

    test("should handle single element", () => {
        const a = new Float32Array([5]);
        const b = new Float32Array([3]);
        expect(vector.add(a, b)).toEqual(new Float32Array([8]));
    });

    test("should handle zeros", () => {
        const a = new Float32Array([0, 0, 0]);
        const b = new Float32Array([0, 0, 0]);
        expect(vector.add(a, b)).toEqual(new Float32Array([0, 0, 0]));
    });

    test("should throw on mismatched lengths", () => {
        const a = new Float32Array([1, 2, 3]);
        const b = new Float32Array([1, 2]);
        expect(() => vector.add(a, b)).toThrow("Vectors must have the same length");
    });
});

describe("vector.sub", () => {
    test("should subtract two vectors element-wise", () => {
        const a = new Float32Array([10, 20, 30, 40]);
        const b = new Float32Array([1, 2, 3, 4]);
        expect(vector.sub(a, b)).toEqual(new Float32Array([9, 18, 27, 36]));
    });

    test("should produce negative results", () => {
        const a = new Float32Array([1, 2, 3]);
        const b = new Float32Array([5, 5, 5]);
        expect(vector.sub(a, b)).toEqual(new Float32Array([-4, -3, -2]));
    });

    test("should handle single element", () => {
        const a = new Float32Array([10]);
        const b = new Float32Array([3]);
        expect(vector.sub(a, b)).toEqual(new Float32Array([7]));
    });

    test("should throw on mismatched lengths", () => {
        const a = new Float32Array([1, 2]);
        const b = new Float32Array([1, 2, 3]);
        expect(() => vector.sub(a, b)).toThrow("Vectors must have the same length");
    });
});

describe("vector.mul", () => {
    test("should multiply two vectors element-wise", () => {
        const a = new Float32Array([2, 3, 4, 5]);
        const b = new Float32Array([10, 20, 30, 40]);
        expect(vector.mul(a, b)).toEqual(new Float32Array([20, 60, 120, 200]));
    });

    test("should handle multiplication by zero", () => {
        const a = new Float32Array([1, 2, 3]);
        const b = new Float32Array([0, 0, 0]);
        expect(vector.mul(a, b)).toEqual(new Float32Array([0, 0, 0]));
    });

    test("should handle single element", () => {
        const a = new Float32Array([7]);
        const b = new Float32Array([6]);
        expect(vector.mul(a, b)).toEqual(new Float32Array([42]));
    });

    test("should throw on mismatched lengths", () => {
        const a = new Float32Array([1, 2, 3]);
        const b = new Float32Array([1, 2]);
        expect(() => vector.mul(a, b)).toThrow("Vectors must have the same length");
    });
});

describe("vector.div", () => {
    test("should divide two vectors element-wise", () => {
        const a = new Float32Array([10, 20, 30, 40]);
        const b = new Float32Array([2, 4, 5, 8]);
        expect(vector.div(a, b)).toEqual(new Float32Array([5, 5, 6, 5]));
    });

    test("should handle single element", () => {
        const a = new Float32Array([9]);
        const b = new Float32Array([3]);
        expect(vector.div(a, b)).toEqual(new Float32Array([3]));
    });

    test("should throw on mismatched lengths", () => {
        const a = new Float32Array([1, 2]);
        const b = new Float32Array([1]);
        expect(() => vector.div(a, b)).toThrow("Vectors must have the same length");
    });
});

describe("vector.dot", () => {
    test("should compute dot product", () => {
        const a = new Float32Array([1, 2, 3]);
        const b = new Float32Array([4, 5, 6]);
        expect(vector.dot(a, b)).toBe(32);
    });

    test("should return zero for orthogonal vectors", () => {
        const a = new Float32Array([1, 0]);
        const b = new Float32Array([0, 1]);
        expect(vector.dot(a, b)).toBe(0);
    });

    test("should handle single element", () => {
        const a = new Float32Array([5]);
        const b = new Float32Array([7]);
        expect(vector.dot(a, b)).toBe(35);
    });

    test("should handle negative values", () => {
        const a = new Float32Array([-1, 2]);
        const b = new Float32Array([3, -4]);
        expect(vector.dot(a, b)).toBe(-11);
    });

    test("should throw on mismatched lengths", () => {
        const a = new Float32Array([1, 2, 3]);
        const b = new Float32Array([1, 2]);
        expect(() => vector.dot(a, b)).toThrow("Vectors must have the same length");
    });
});

describe("vector.cross", () => {
    test("should compute cross product", () => {
        const a = new Float32Array([1, 0, 0]);
        const b = new Float32Array([0, 1, 0]);
        expect(vector.cross(a, b)).toEqual(new Float32Array([0, 0, 1]));
    });

    test("should compute cross product of unit vectors", () => {
        const a = new Float32Array([0, 0, 1]);
        const b = new Float32Array([1, 0, 0]);
        expect(vector.cross(a, b)).toEqual(new Float32Array([0, 1, 0]));
    });

    test("should return zero for parallel vectors", () => {
        const a = new Float32Array([1, 2, 3]);
        const b = new Float32Array([2, 4, 6]);
        expect(vector.cross(a, b)).toEqual(new Float32Array([0, 0, 0]));
    });

    test("should throw if a is not length 3", () => {
        const a = new Float32Array([1, 2]);
        const b = new Float32Array([1, 2, 3]);
        expect(() => vector.cross(a, b)).toThrow("Cross product requires vectors of length 3");
    });

    test("should throw if b is not length 3", () => {
        const a = new Float32Array([1, 2, 3]);
        const b = new Float32Array([1, 2]);
        expect(() => vector.cross(a, b)).toThrow("Cross product requires vectors of length 3");
    });
});

describe("vector.norm", () => {
    test("should compute L2 norm", () => {
        const a = new Float32Array([3, 4]);
        expect(vector.norm(a)).toBe(5);
    });

    test("should return 1 for unit vector", () => {
        const a = new Float32Array([1, 0, 0]);
        expect(vector.norm(a)).toBeCloseTo(1, 5);
    });

    test("should return 0 for zero vector", () => {
        const a = new Float32Array([0, 0, 0]);
        expect(vector.norm(a)).toBe(0);
    });

    test("should handle single element", () => {
        const a = new Float32Array([7]);
        expect(vector.norm(a)).toBe(7);
    });

    test("should handle negative values", () => {
        const a = new Float32Array([-3, -4]);
        expect(vector.norm(a)).toBe(5);
    });
});

describe("vector.normalize", () => {
    test("should normalize to unit vector", () => {
        const a = new Float32Array([3, 4]);
        const result = vector.normalize(a);
        expect(result[0]).toBeCloseTo(0.6, 5);
        expect(result[1]).toBeCloseTo(0.8, 5);
    });

    test("should preserve direction", () => {
        const a = new Float32Array([0, 5]);
        const result = vector.normalize(a);
        expect(result[0]).toBeCloseTo(0, 5);
        expect(result[1]).toBeCloseTo(1, 5);
    });

    test("should handle single element", () => {
        const a = new Float32Array([10]);
        const result = vector.normalize(a);
        expect(result[0]).toBeCloseTo(1, 5);
    });

    test("should handle negative values", () => {
        const a = new Float32Array([-3, -4]);
        const result = vector.normalize(a);
        expect(result[0]).toBeCloseTo(-0.6, 5);
        expect(result[1]).toBeCloseTo(-0.8, 5);
    });
});

describe("vector.scale", () => {
    test("should scale vector by scalar", () => {
        const a = new Float32Array([1, 2, 3]);
        expect(vector.scale(a, 3)).toEqual(new Float32Array([3, 6, 9]));
    });

    test("should handle scale by zero", () => {
        const a = new Float32Array([1, 2, 3]);
        expect(vector.scale(a, 0)).toEqual(new Float32Array([0, 0, 0]));
    });

    test("should handle negative scalar", () => {
        const a = new Float32Array([1, -2, 3]);
        expect(vector.scale(a, -1)).toEqual(new Float32Array([-1, 2, -3]));
    });

    test("should handle single element", () => {
        const a = new Float32Array([5]);
        expect(vector.scale(a, 4)).toEqual(new Float32Array([20]));
    });
});

describe("vector.argmin", () => {
    test("should return index of minimum", () => {
        const a = new Float32Array([5, 3, 8, 1, 9]);
        expect(vector.argmin(a)).toBe(3);
    });

    test("should return 0 for first element minimum", () => {
        const a = new Float32Array([1, 2, 3]);
        expect(vector.argmin(a)).toBe(0);
    });

    test("should return last index for last element minimum", () => {
        const a = new Float32Array([3, 2, 1]);
        expect(vector.argmin(a)).toBe(2);
    });

    test("should handle single element", () => {
        const a = new Float32Array([42]);
        expect(vector.argmin(a)).toBe(0);
    });

    test("should handle negative values", () => {
        const a = new Float32Array([-5, -1, -10]);
        expect(vector.argmin(a)).toBe(2);
    });

    test("should throw on empty vector", () => {
        const a = new Float32Array([]);
        expect(() => vector.argmin(a)).toThrow("Vector must not be empty");
    });
});

describe("vector.argmax", () => {
    test("should return index of maximum", () => {
        const a = new Float32Array([5, 3, 8, 1, 9]);
        expect(vector.argmax(a)).toBe(4);
    });

    test("should return 0 for first element maximum", () => {
        const a = new Float32Array([10, 2, 3]);
        expect(vector.argmax(a)).toBe(0);
    });

    test("should return last index for last element maximum", () => {
        const a = new Float32Array([1, 2, 10]);
        expect(vector.argmax(a)).toBe(2);
    });

    test("should handle single element", () => {
        const a = new Float32Array([42]);
        expect(vector.argmax(a)).toBe(0);
    });

    test("should handle negative values", () => {
        const a = new Float32Array([-5, -1, -10]);
        expect(vector.argmax(a)).toBe(1);
    });

    test("should throw on empty vector", () => {
        const a = new Float32Array([]);
        expect(() => vector.argmax(a)).toThrow("Vector must not be empty");
    });
});

describe("vector.fill", () => {
    test("should fill with specified value", () => {
        const result = vector.fill(5, 7);
        expect(result).toEqual(new Float32Array([7, 7, 7, 7, 7]));
    });

    test("should fill with zero", () => {
        const result = vector.fill(3, 0);
        expect(result).toEqual(new Float32Array([0, 0, 0]));
    });

    test("should fill with negative value", () => {
        const result = vector.fill(4, -3);
        expect(result).toEqual(new Float32Array([-3, -3, -3, -3]));
    });

    test("should handle length 0", () => {
        const result = vector.fill(0, 5);
        expect(result.length).toBe(0);
    });

    test("should handle length 1", () => {
        const result = vector.fill(1, 99);
        expect(result).toEqual(new Float32Array([99]));
    });
});

describe("vector.zero", () => {
    test("should create zero-filled vector", () => {
        const result = vector.zero(5);
        expect(result).toEqual(new Float32Array([0, 0, 0, 0, 0]));
    });

    test("should handle length 0", () => {
        const result = vector.zero(0);
        expect(result.length).toBe(0);
    });

    test("should handle length 1", () => {
        const result = vector.zero(1);
        expect(result).toEqual(new Float32Array([0]));
    });
});

describe("vector.sum", () => {
    test("should sum elements", () => {
        const a = new Float32Array([1, 2, 3, 4]);
        expect(vector.sum(a)).toBe(10);
    });

    test("should return 0 for zero vector", () => {
        const a = new Float32Array([0, 0, 0]);
        expect(vector.sum(a)).toBe(0);
    });

    test("should handle single element", () => {
        const a = new Float32Array([42]);
        expect(vector.sum(a)).toBe(42);
    });

    test("should handle negative values", () => {
        const a = new Float32Array([1, -2, 3, -4]);
        expect(vector.sum(a)).toBe(-2);
    });

    test("should return 0 for empty vector", () => {
        const a = new Float32Array([]);
        expect(vector.sum(a)).toBe(0);
    });
});

describe("vector.mean", () => {
    test("should compute arithmetic mean", () => {
        const a = new Float32Array([2, 4, 6, 8]);
        expect(vector.mean(a)).toBe(5);
    });

    test("should handle single element", () => {
        const a = new Float32Array([42]);
        expect(vector.mean(a)).toBe(42);
    });

    test("should handle negative values", () => {
        const a = new Float32Array([-1, 1]);
        expect(vector.mean(a)).toBe(0);
    });

    test("should handle zeros", () => {
        const a = new Float32Array([0, 0, 0]);
        expect(vector.mean(a)).toBe(0);
    });

    test("should throw on empty vector", () => {
        const a = new Float32Array([]);
        expect(() => vector.mean(a)).toThrow("Vector must not be empty");
    });
});

describe("vector.lerp", () => {
    test("should interpolate at t=0", () => {
        const a = new Float32Array([0, 0]);
        const b = new Float32Array([10, 20]);
        expect(vector.lerp(a, b, 0)).toEqual(new Float32Array([0, 0]));
    });

    test("should interpolate at t=1", () => {
        const a = new Float32Array([0, 0]);
        const b = new Float32Array([10, 20]);
        expect(vector.lerp(a, b, 1)).toEqual(new Float32Array([10, 20]));
    });

    test("should interpolate at t=0.5", () => {
        const a = new Float32Array([0, 0]);
        const b = new Float32Array([10, 20]);
        const result = vector.lerp(a, b, 0.5);
        expect(result[0]).toBeCloseTo(5, 5);
        expect(result[1]).toBeCloseTo(10, 5);
    });

    test("should handle single element", () => {
        const a = new Float32Array([0]);
        const b = new Float32Array([100]);
        expect(vector.lerp(a, b, 0.25)).toEqual(new Float32Array([25]));
    });

    test("should throw on mismatched lengths", () => {
        const a = new Float32Array([1, 2]);
        const b = new Float32Array([1, 2, 3]);
        expect(() => vector.lerp(a, b, 0.5)).toThrow("Vectors must have the same length");
    });
});

describe("vector.clamp", () => {
    test("should clamp values within range", () => {
        const a = new Float32Array([1, 5, 10]);
        expect(vector.clamp(a, 2, 8)).toEqual(new Float32Array([2, 5, 8]));
    });

    test("should not modify values already in range", () => {
        const a = new Float32Array([3, 5, 7]);
        expect(vector.clamp(a, 2, 8)).toEqual(new Float32Array([3, 5, 7]));
    });

    test("should clamp all below min", () => {
        const a = new Float32Array([-10, -5, -1]);
        expect(vector.clamp(a, 0, 100)).toEqual(new Float32Array([0, 0, 0]));
    });

    test("should clamp all above max", () => {
        const a = new Float32Array([100, 200, 300]);
        expect(vector.clamp(a, 0, 50)).toEqual(new Float32Array([50, 50, 50]));
    });

    test("should handle single element", () => {
        const a = new Float32Array([5]);
        expect(vector.clamp(a, 0, 10)).toEqual(new Float32Array([5]));
    });

    test("should not mutate original", () => {
        const a = new Float32Array([-5, 5, 15]);
        vector.clamp(a, 0, 10);
        expect(a).toEqual(new Float32Array([-5, 5, 15]));
    });
});

describe("vector.sort", () => {
    test("should sort in ascending order", () => {
        const a = new Float32Array([5, 3, 1, 4, 2]);
        expect(vector.sort(a)).toEqual(new Float32Array([1, 2, 3, 4, 5]));
    });

    test("should handle already sorted", () => {
        const a = new Float32Array([1, 2, 3, 4]);
        expect(vector.sort(a)).toEqual(new Float32Array([1, 2, 3, 4]));
    });

    test("should handle reverse sorted", () => {
        const a = new Float32Array([5, 4, 3, 2, 1]);
        expect(vector.sort(a)).toEqual(new Float32Array([1, 2, 3, 4, 5]));
    });

    test("should handle single element", () => {
        const a = new Float32Array([42]);
        expect(vector.sort(a)).toEqual(new Float32Array([42]));
    });

    test("should handle negative values", () => {
        const a = new Float32Array([-3, -1, -2]);
        expect(vector.sort(a)).toEqual(new Float32Array([-3, -2, -1]));
    });

    test("should handle duplicates", () => {
        const a = new Float32Array([3, 1, 3, 2, 1]);
        expect(vector.sort(a)).toEqual(new Float32Array([1, 1, 2, 3, 3]));
    });

    test("should not mutate original", () => {
        const a = new Float32Array([5, 3, 1]);
        vector.sort(a);
        expect(a).toEqual(new Float32Array([5, 3, 1]));
    });
});
