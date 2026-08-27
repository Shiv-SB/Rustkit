import { describe, test, expect } from "bun:test";
import { search } from "../src/index";

describe("search.binarySearch", () => {
    test("should find existing element", () => {
        expect(search.binarySearch(new Int32Array([1, 2, 3, 4, 5]), 3)).toBe(2);
    });

    test("should find first element", () => {
        expect(search.binarySearch(new Int32Array([1, 2, 3, 4, 5]), 1)).toBe(0);
    });

    test("should find last element", () => {
        expect(search.binarySearch(new Int32Array([1, 2, 3, 4, 5]), 5)).toBe(4);
    });

    test("should return null for missing element", () => {
        expect(search.binarySearch(new Int32Array([1, 2, 3, 4, 5]), 6)).toBeNull();
    });

    test("should return null for empty array", () => {
        expect(search.binarySearch(new Int32Array([]), 1)).toBeNull();
    });

    test("should handle single element found", () => {
        expect(search.binarySearch(new Int32Array([5]), 5)).toBe(0);
    });

    test("should handle single element not found", () => {
        expect(search.binarySearch(new Int32Array([5]), 3)).toBeNull();
    });

    test("should handle negative values", () => {
        expect(search.binarySearch(new Int32Array([-5, -3, -1, 0, 2]), -3)).toBe(1);
    });
});

describe("search.lowerBound", () => {
    test("should find position before first >= target", () => {
        expect(search.lowerBound(new Int32Array([1, 2, 2, 3, 4]), 2)).toBe(1);
    });

    test("should return 0 when target is before all", () => {
        expect(search.lowerBound(new Int32Array([1, 2, 3]), 0)).toBe(0);
    });

    test("should return length when target is after all", () => {
        expect(search.lowerBound(new Int32Array([1, 2, 3]), 5)).toBe(3);
    });

    test("should handle empty array", () => {
        expect(search.lowerBound(new Int32Array([]), 1)).toBe(0);
    });

    test("should handle duplicates", () => {
        expect(search.lowerBound(new Int32Array([2, 2, 2, 2]), 2)).toBe(0);
    });

    test("should find first element", () => {
        expect(search.lowerBound(new Int32Array([1, 2, 3]), 1)).toBe(0);
    });
});

describe("search.upperBound", () => {
    test("should find position after last <= target", () => {
        expect(search.upperBound(new Int32Array([1, 2, 2, 3, 4]), 2)).toBe(3);
    });

    test("should return 0 when target is before all", () => {
        expect(search.upperBound(new Int32Array([1, 2, 3]), 0)).toBe(0);
    });

    test("should return length when target is >= all", () => {
        expect(search.upperBound(new Int32Array([1, 2, 3]), 3)).toBe(3);
    });

    test("should handle empty array", () => {
        expect(search.upperBound(new Int32Array([]), 1)).toBe(0);
    });

    test("should handle duplicates", () => {
        expect(search.upperBound(new Int32Array([2, 2, 2, 2]), 2)).toBe(4);
    });

    test("should return length when target is after all", () => {
        expect(search.upperBound(new Int32Array([1, 2, 3]), 5)).toBe(3);
    });
});

describe("search.linearSearch", () => {
    test("should find existing element", () => {
        expect(search.linearSearch(new Int32Array([5, 3, 1, 4, 2]), 4)).toBe(3);
    });

    test("should return null for missing element", () => {
        expect(search.linearSearch(new Int32Array([5, 3, 1, 4, 2]), 6)).toBeNull();
    });

    test("should find first element", () => {
        expect(search.linearSearch(new Int32Array([1, 2, 3]), 1)).toBe(0);
    });

    test("should find last element", () => {
        expect(search.linearSearch(new Int32Array([1, 2, 3]), 3)).toBe(2);
    });

    test("should return null for empty array", () => {
        expect(search.linearSearch(new Int32Array([]), 1)).toBeNull();
    });

    test("should handle single element found", () => {
        expect(search.linearSearch(new Int32Array([5]), 5)).toBe(0);
    });

    test("should handle single element not found", () => {
        expect(search.linearSearch(new Int32Array([5]), 3)).toBeNull();
    });

    test("should find first occurrence", () => {
        expect(search.linearSearch(new Int32Array([1, 2, 1, 2]), 1)).toBe(0);
    });

    test("should handle negative values", () => {
        expect(search.linearSearch(new Int32Array([-5, -3, -1]), -3)).toBe(1);
    });
});
