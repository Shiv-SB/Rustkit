import { describe, test, expect } from "bun:test";
import { sort } from "../src/index";

describe("sort.quicksort", () => {
    test("should sort unsorted array", () => {
        expect(sort.quicksort(new Int32Array([5, 3, 1, 4, 2]))).toEqual(
            new Int32Array([1, 2, 3, 4, 5])
        );
    });

    test("should handle already sorted", () => {
        expect(sort.quicksort(new Int32Array([1, 2, 3, 4]))).toEqual(
            new Int32Array([1, 2, 3, 4])
        );
    });

    test("should handle reverse sorted", () => {
        expect(sort.quicksort(new Int32Array([5, 4, 3, 2, 1]))).toEqual(
            new Int32Array([1, 2, 3, 4, 5])
        );
    });

    test("should handle single element", () => {
        expect(sort.quicksort(new Int32Array([42]))).toEqual(new Int32Array([42]));
    });

    test("should handle negative values", () => {
        expect(sort.quicksort(new Int32Array([-3, -1, -2]))).toEqual(
            new Int32Array([-3, -2, -1])
        );
    });

    test("should handle duplicates", () => {
        expect(sort.quicksort(new Int32Array([3, 1, 3, 2, 1]))).toEqual(
            new Int32Array([1, 1, 2, 3, 3])
        );
    });

    test("should not mutate original", () => {
        const a = new Int32Array([5, 3, 1]);
        sort.quicksort(a);
        expect(a).toEqual(new Int32Array([5, 3, 1]));
    });
});

describe("sort.argsort", () => {
    test("should return indices in sorted order", () => {
        const result = sort.argsort(new Float32Array([5, 3, 1, 4, 2]));
        expect(result).toEqual(new Uint32Array([2, 4, 1, 3, 0]));
    });

    test("should handle already sorted", () => {
        const result = sort.argsort(new Float32Array([1, 2, 3]));
        expect(result).toEqual(new Uint32Array([0, 1, 2]));
    });

    test("should handle reverse sorted", () => {
        const result = sort.argsort(new Float32Array([3, 2, 1]));
        expect(result).toEqual(new Uint32Array([2, 1, 0]));
    });

    test("should handle single element", () => {
        const result = sort.argsort(new Float32Array([42]));
        expect(result).toEqual(new Uint32Array([0]));
    });

    test("should handle negative values", () => {
        const result = sort.argsort(new Float32Array([-3, -1, -2]));
        expect(result).toEqual(new Uint32Array([0, 2, 1]));
    });

    test("should handle duplicates", () => {
        const result = sort.argsort(new Float32Array([2, 1, 2]));
        expect(result).toEqual(new Uint32Array([1, 0, 2]));
    });

    test("should return Uint32Array", () => {
        const result = sort.argsort(new Float32Array([1, 2, 3]));
        expect(result).toBeInstanceOf(Uint32Array);
    });
});

describe("sort.isSorted", () => {
    test("should return true for sorted array", () => {
        expect(sort.isSorted(new Int32Array([1, 2, 3, 4, 5]))).toBe(true);
    });

    test("should return false for unsorted array", () => {
        expect(sort.isSorted(new Int32Array([5, 3, 1, 4, 2]))).toBe(false);
    });

    test("should return true for single element", () => {
        expect(sort.isSorted(new Int32Array([42]))).toBe(true);
    });

    test("should return true for empty array", () => {
        expect(sort.isSorted(new Int32Array([]))).toBe(true);
    });

    test("should return true for duplicates in order", () => {
        expect(sort.isSorted(new Int32Array([1, 1, 2, 2, 3]))).toBe(true);
    });

    test("should return false for reverse sorted", () => {
        expect(sort.isSorted(new Int32Array([5, 4, 3, 2, 1]))).toBe(false);
    });
});

describe("sort.selectKth", () => {
    test("should find 0th element (minimum)", () => {
        expect(sort.selectKth(new Int32Array([5, 3, 1, 4, 2]), 0)).toBe(1);
    });

    test("should find last element (maximum)", () => {
        expect(sort.selectKth(new Int32Array([5, 3, 1, 4, 2]), 4)).toBe(5);
    });

    test("should find middle element", () => {
        expect(sort.selectKth(new Int32Array([5, 3, 1, 4, 2]), 2)).toBe(3);
    });

    test("should handle single element", () => {
        expect(sort.selectKth(new Int32Array([42]), 0)).toBe(42);
    });

    test("should handle negative values", () => {
        expect(sort.selectKth(new Int32Array([-3, -1, -2]), 1)).toBe(-2);
    });

    test("should throw on out of bounds k", () => {
        expect(() => sort.selectKth(new Int32Array([1, 2, 3]), 3)).toThrow("k must be within array bounds");
    });

    test("should throw on negative k", () => {
        expect(() => sort.selectKth(new Int32Array([1, 2, 3]), -1)).toThrow("k must be within array bounds");
    });

    test("should not mutate original", () => {
        const a = new Int32Array([5, 3, 1]);
        sort.selectKth(a, 1);
        expect(a).toEqual(new Int32Array([5, 3, 1]));
    });
});
