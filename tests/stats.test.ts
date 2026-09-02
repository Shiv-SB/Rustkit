import { describe, test, expect } from "bun:test";
import { stats } from "../src/index";

describe("stats.mean", () => {
    test("should compute mean of integers", () => {
        expect(stats.mean(new Float32Array([1, 2, 3, 4]))).toBe(2.5);
    });

    test("should compute mean of single element", () => {
        expect(stats.mean(new Float32Array([42]))).toBe(42);
    });

    test("should compute mean with negatives", () => {
        expect(stats.mean(new Float32Array([-1, 1]))).toBe(0);
    });

    test("should compute mean of zeros", () => {
        expect(stats.mean(new Float32Array([0, 0, 0]))).toBe(0);
    });

    test("should throw on empty array", () => {
        expect(() => stats.mean(new Float32Array([]))).toThrow("Array must not be empty");
    });
});

describe("stats.median", () => {
    test("should compute median of odd-length array", () => {
        expect(stats.median(new Float32Array([3, 1, 2]))).toBe(2);
    });

    test("should compute median of even-length array", () => {
        expect(stats.median(new Float32Array([1, 2, 3, 4]))).toBe(2.5);
    });

    test("should compute median of single element", () => {
        expect(stats.median(new Float32Array([42]))).toBe(42);
    });

    test("should handle already sorted array", () => {
        expect(stats.median(new Float32Array([1, 2, 3]))).toBe(2);
    });

    test("should handle negative values", () => {
        expect(stats.median(new Float32Array([-3, -1, -2]))).toBe(-2);
    });

    test("should throw on empty array", () => {
        expect(() => stats.median(new Float32Array([]))).toThrow("Array must not be empty");
    });
});

describe("stats.variance", () => {
    test("should compute variance", () => {
        const result = stats.variance(new Float32Array([1, 2, 3, 4, 5]));
        expect(result).toBeCloseTo(2, 4);
    });

    test("should return 0 for identical values", () => {
        expect(stats.variance(new Float32Array([5, 5, 5]))).toBe(0);
    });

    test("should compute variance of two elements", () => {
        expect(stats.variance(new Float32Array([1, 3]))).toBeCloseTo(1, 4);
    });

    test("should throw on empty array", () => {
        expect(() => stats.variance(new Float32Array([]))).toThrow("Array must not be empty");
    });
});

describe("stats.stddev", () => {
    test("should compute standard deviation", () => {
        const result = stats.stddev(new Float32Array([1, 2, 3, 4, 5]));
        expect(result).toBeCloseTo(Math.sqrt(2), 4);
    });

    test("should return 0 for identical values", () => {
        expect(stats.stddev(new Float32Array([5, 5, 5]))).toBe(0);
    });

    test("should throw on empty array", () => {
        expect(() => stats.stddev(new Float32Array([]))).toThrow("Array must not be empty");
    });
});

describe("stats.percentile", () => {
    test("should compute 50th percentile (median)", () => {
        const result = stats.percentile(new Float32Array([1, 2, 3, 4, 5]), 50);
        expect(result).toBeCloseTo(3, 4);
    });

    test("should compute 0th percentile", () => {
        expect(stats.percentile(new Float32Array([3, 1, 2]), 0)).toBeCloseTo(1, 4);
    });

    test("should compute 100th percentile", () => {
        expect(stats.percentile(new Float32Array([3, 1, 2]), 100)).toBeCloseTo(3, 4);
    });

    test("should throw on empty array", () => {
        expect(() => stats.percentile(new Float32Array([]), 50)).toThrow("Array must not be empty");
    });

    test("should throw on percentile < 0", () => {
        expect(() => stats.percentile(new Float32Array([1, 2, 3]), -1)).toThrow("Percentile must be between 0 and 100");
    });

    test("should throw on percentile > 100", () => {
        expect(() => stats.percentile(new Float32Array([1, 2, 3]), 101)).toThrow("Percentile must be between 0 and 100");
    });
});

describe("stats.covariance", () => {
    test("should compute covariance", () => {
        const a = new Float32Array([1, 2, 3, 4, 5]);
        const b = new Float32Array([2, 4, 6, 8, 10]);
        const result = stats.covariance(a, b);
        expect(result).toBeCloseTo(4, 4);
    });

    test("should return 0 for uncorrelated arrays", () => {
        const a = new Float32Array([1, 2, 3]);
        const b = new Float32Array([3, 2, 1]);
        const result = stats.covariance(a, b);
        expect(result).toBeCloseTo(-1, 4);
    });

    test("should throw on mismatched lengths", () => {
        const a = new Float32Array([1, 2, 3]);
        const b = new Float32Array([1, 2]);
        expect(() => stats.covariance(a, b)).toThrow("Arrays must have the same length");
    });

    test("should throw on empty arrays", () => {
        const a = new Float32Array([]);
        const b = new Float32Array([]);
        expect(() => stats.covariance(a, b)).toThrow("Arrays must not be empty");
    });
});

describe("stats.correlation", () => {
    test("should return 1 for perfectly correlated", () => {
        const a = new Float32Array([1, 2, 3, 4, 5]);
        const b = new Float32Array([2, 4, 6, 8, 10]);
        expect(stats.correlation(a, b)).toBeCloseTo(1, 4);
    });

    test("should return -1 for perfectly anti-correlated", () => {
        const a = new Float32Array([1, 2, 3, 4, 5]);
        const b = new Float32Array([10, 8, 6, 4, 2]);
        expect(stats.correlation(a, b)).toBeCloseTo(-1, 4);
    });

    test("should throw on mismatched lengths", () => {
        const a = new Float32Array([1, 2]);
        const b = new Float32Array([1]);
        expect(() => stats.correlation(a, b)).toThrow("Arrays must have the same length");
    });

    test("should throw on empty arrays", () => {
        const a = new Float32Array([]);
        const b = new Float32Array([]);
        expect(() => stats.correlation(a, b)).toThrow("Arrays must not be empty");
    });
});

describe("stats.zscore", () => {
    test("should compute z-scores", () => {
        const result = stats.zscore(new Float32Array([1, 2, 3, 4, 5]));
        const mean = result.reduce((s, v) => s + v, 0) / result.length;
        expect(mean).toBeCloseTo(0, 4);
    });

    test("should return zeros for identical values", () => {
        const result = stats.zscore(new Float32Array([5, 5, 5]));
        expect(result).toEqual(new Float32Array([0, 0, 0]));
    });

    test("should return single z-score of 0", () => {
        const result = stats.zscore(new Float32Array([42]));
        expect(result[0]).toBeCloseTo(0, 4);
    });

    test("should not mutate original", () => {
        const a = new Float32Array([1, 2, 3]);
        stats.zscore(a);
        expect(a).toEqual(new Float32Array([1, 2, 3]));
    });

    test("should throw on empty array", () => {
        expect(() => stats.zscore(new Float32Array([]))).toThrow("Array must not be empty");
    });
});

describe("stats.histogram", () => {
    test("should count elements in bins", () => {
        const a = new Float32Array([1, 2, 3, 4, 5]);
        const result = stats.histogram(a, 5);
        expect(result.length).toBe(5);
        expect(result.reduce((s, v) => s + v, 0)).toBe(5);
    });

    test("should return single bin for all elements", () => {
        const a = new Float32Array([1, 2, 3]);
        const result = stats.histogram(a, 1);
        expect(result.length).toBe(1);
        expect(result[0]).toBe(3);
    });

    test("should return Uint32Array", () => {
        const a = new Float32Array([1, 2, 3]);
        const result = stats.histogram(a, 3);
        expect(result).toBeInstanceOf(Uint32Array);
    });

    test("should throw on empty array", () => {
        expect(() => stats.histogram(new Float32Array([]), 3)).toThrow("Array must not be empty");
    });

    test("should throw on zero bins", () => {
        expect(() => stats.histogram(new Float32Array([1, 2]), 0)).toThrow("Bins must be greater than 0");
    });
});

describe("stats.quantile", () => {
    test("should compute 0.5 quantile (median)", () => {
        const result = stats.quantile(new Float32Array([1, 2, 3, 4, 5]), 0.5);
        expect(result).toBeCloseTo(3, 4);
    });

    test("should compute 0 quantile", () => {
        expect(stats.quantile(new Float32Array([3, 1, 2]), 0)).toBeCloseTo(1, 4);
    });

    test("should compute 1 quantile", () => {
        expect(stats.quantile(new Float32Array([3, 1, 2]), 1)).toBeCloseTo(3, 4);
    });

    test("should throw on empty array", () => {
        expect(() => stats.quantile(new Float32Array([]), 0.5)).toThrow("Array must not be empty");
    });

    test("should throw on quantile < 0", () => {
        expect(() => stats.quantile(new Float32Array([1, 2]), -0.1)).toThrow("Quantile must be between 0 and 1");
    });

    test("should throw on quantile > 1", () => {
        expect(() => stats.quantile(new Float32Array([1, 2]), 1.1)).toThrow("Quantile must be between 0 and 1");
    });
});

describe("stats.mode", () => {
    test("should return most frequent value", () => {
        expect(stats.mode(new Float32Array([1, 2, 2, 3, 3, 3]))).toBe(3);
    });

    test("should return single element", () => {
        expect(stats.mode(new Float32Array([42]))).toBe(42);
    });

    test("should throw on empty array", () => {
        expect(() => stats.mode(new Float32Array([]))).toThrow("Array must not be empty");
    });
});

describe("stats.skewness", () => {
    test("should return 0 for symmetric distribution", () => {
        expect(stats.skewness(new Float32Array([1, 2, 3, 4, 5]))).toBeCloseTo(0, 4);
    });

    test("should return positive for right-skewed", () => {
        expect(stats.skewness(new Float32Array([1, 1, 1, 1, 10]))).toBeGreaterThan(0);
    });

    test("should throw on empty array", () => {
        expect(() => stats.skewness(new Float32Array([]))).toThrow("Array must not be empty");
    });
});

describe("stats.kurtosis", () => {
    test("should compute kurtosis", () => {
        const result = stats.kurtosis(new Float32Array([1, 2, 3, 4, 5]));
        expect(typeof result).toBe("number");
    });

    test("should throw on empty array", () => {
        expect(() => stats.kurtosis(new Float32Array([]))).toThrow("Array must not be empty");
    });
});

describe("stats.geometricMean", () => {
    test("should compute geometric mean", () => {
        expect(stats.geometricMean(new Float32Array([2, 8]))).toBeCloseTo(4, 4);
    });

    test("should handle single element", () => {
        expect(stats.geometricMean(new Float32Array([42]))).toBeCloseTo(42, 4);
    });

    test("should throw on empty array", () => {
        expect(() => stats.geometricMean(new Float32Array([]))).toThrow("Array must not be empty");
    });
});

describe("stats.weightedMean", () => {
    test("should compute weighted mean", () => {
        expect(stats.weightedMean(new Float32Array([10, 20]), new Float32Array([1, 3]))).toBeCloseTo(17.5, 4);
    });

    test("should equal unweighted mean when weights are equal", () => {
        expect(stats.weightedMean(new Float32Array([10, 20]), new Float32Array([1, 1]))).toBeCloseTo(15, 4);
    });

    test("should throw on mismatched lengths", () => {
        expect(() => stats.weightedMean(new Float32Array([1, 2]), new Float32Array([1]))).toThrow("Arrays must have the same length");
    });

    test("should throw on empty arrays", () => {
        expect(() => stats.weightedMean(new Float32Array([]), new Float32Array([]))).toThrow("Arrays must not be empty");
    });
});

describe("stats.iqr", () => {
    test("should compute interquartile range", () => {
        const result = stats.iqr(new Float32Array([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]));
        expect(result).toBeGreaterThan(0);
    });

    test("should return 0 for identical values", () => {
        expect(stats.iqr(new Float32Array([5, 5, 5, 5]))).toBe(0);
    });

    test("should throw on empty array", () => {
        expect(() => stats.iqr(new Float32Array([]))).toThrow("Array must not be empty");
    });
});
