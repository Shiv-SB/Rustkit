import { describe, test, expect } from "bun:test";
import { matrix } from "../src/index";

describe("matrix.mul", () => {
    test("should multiply 2x2 matrices", () => {
        const a = new Float32Array([1, 2, 3, 4]);
        const b = new Float32Array([5, 6, 7, 8]);
        const result = matrix.mul(a, b, 2, 2, 2);
        expect(result).toEqual(new Float32Array([19, 22, 43, 50]));
    });

    test("should multiply non-square matrices", () => {
        const a = new Float32Array([1, 2, 3, 4, 5, 6]);
        const b = new Float32Array([7, 8, 9, 10, 11, 12]);
        const result = matrix.mul(a, b, 2, 3, 2);
        expect(result).toEqual(new Float32Array([58, 64, 139, 154]));
    });

    test("should multiply by identity", () => {
        const a = new Float32Array([1, 2, 3, 4]);
        const identity = new Float32Array([1, 0, 0, 1]);
        const result = matrix.mul(a, identity, 2, 2, 2);
        expect(result).toEqual(new Float32Array([1, 2, 3, 4]));
    });

    test("should handle single element matrices", () => {
        const a = new Float32Array([5]);
        const b = new Float32Array([3]);
        const result = matrix.mul(a, b, 1, 1, 1);
        expect(result).toEqual(new Float32Array([15]));
    });

    test("should throw on A dimensions mismatch", () => {
        const a = new Float32Array([1, 2, 3]);
        const b = new Float32Array([1, 2, 3, 4]);
        expect(() => matrix.mul(a, b, 2, 2, 2)).toThrow("Matrix A dimensions mismatch");
    });

    test("should throw on B dimensions mismatch", () => {
        const a = new Float32Array([1, 2, 3, 4]);
        const b = new Float32Array([1, 2, 3]);
        expect(() => matrix.mul(a, b, 2, 2, 2)).toThrow("Matrix B dimensions mismatch");
    });
});

describe("matrix.transpose", () => {
    test("should transpose 2x3 to 3x2", () => {
        const a = new Float32Array([1, 2, 3, 4, 5, 6]);
        const result = matrix.transpose(a, 2, 3);
        expect(result).toEqual(new Float32Array([1, 4, 2, 5, 3, 6]));
    });

    test("should transpose square matrix", () => {
        const a = new Float32Array([1, 2, 3, 4, 5, 6, 7, 8, 9]);
        const result = matrix.transpose(a, 3, 3);
        expect(result).toEqual(new Float32Array([1, 4, 7, 2, 5, 8, 3, 6, 9]));
    });

    test("should transpose 1xN matrix", () => {
        const a = new Float32Array([1, 2, 3]);
        const result = matrix.transpose(a, 1, 3);
        expect(result).toEqual(new Float32Array([1, 2, 3]));
    });

    test("should transpose Nx1 matrix", () => {
        const a = new Float32Array([1, 2, 3]);
        const result = matrix.transpose(a, 3, 1);
        expect(result).toEqual(new Float32Array([1, 2, 3]));
    });

    test("should throw on dimensions mismatch", () => {
        const a = new Float32Array([1, 2, 3]);
        expect(() => matrix.transpose(a, 2, 2)).toThrow("Matrix dimensions mismatch");
    });
});

describe("matrix.determinant", () => {
    test("should compute determinant of 1x1", () => {
        const a = new Float32Array([5]);
        expect(matrix.determinant(a, 1)).toBe(5);
    });

    test("should compute determinant of 2x2", () => {
        const a = new Float32Array([1, 2, 3, 4]);
        expect(matrix.determinant(a, 2)).toBe(-2);
    });

    test("should compute determinant of 3x3", () => {
        const a = new Float32Array([6, 1, 1, 4, -2, 5, 2, 8, 7]);
        expect(matrix.determinant(a, 3)).toBe(-306);
    });

    test("should return 0 for singular matrix", () => {
        const a = new Float32Array([1, 2, 2, 4]);
        expect(matrix.determinant(a, 2)).toBe(0);
    });

    test("should throw on non-square matrix", () => {
        const a = new Float32Array([1, 2, 3, 4, 5, 6]);
        expect(() => matrix.determinant(a, 2)).toThrow("Matrix must be square");
    });
});

describe("matrix.inverse", () => {
    test("should compute inverse of 2x2", () => {
        const a = new Float32Array([1, 2, 3, 4]);
        const result = matrix.inverse(a, 2);
        expect(result[0]).toBeCloseTo(-2, 5);
        expect(result[1]).toBeCloseTo(1, 5);
        expect(result[2]).toBeCloseTo(1.5, 5);
        expect(result[3]).toBeCloseTo(-0.5, 5);
    });

    test("should compute inverse of identity", () => {
        const a = new Float32Array([1, 0, 0, 1]);
        const result = matrix.inverse(a, 2);
        expect(result[0]).toBeCloseTo(1, 5);
        expect(result[1]).toBeCloseTo(0, 5);
        expect(result[2]).toBeCloseTo(0, 5);
        expect(result[3]).toBeCloseTo(1, 5);
    });

    test("should compute inverse of 1x1", () => {
        const a = new Float32Array([4]);
        const result = matrix.inverse(a, 1);
        expect(result[0]).toBeCloseTo(0.25, 5);
    });

    test("should throw on singular matrix", () => {
        const a = new Float32Array([1, 2, 2, 4]);
        expect(() => matrix.inverse(a, 2)).toThrow("Matrix is singular and cannot be inverted");
    });

    test("should throw on non-square matrix", () => {
        const a = new Float32Array([1, 2, 3, 4, 5, 6]);
        expect(() => matrix.inverse(a, 2)).toThrow("Matrix must be square");
    });
});

describe("matrix.add", () => {
    test("should add two matrices", () => {
        const a = new Float32Array([1, 2, 3, 4]);
        const b = new Float32Array([5, 6, 7, 8]);
        expect(matrix.add(a, b, 2, 2)).toEqual(new Float32Array([6, 8, 10, 12]));
    });

    test("should handle adding zeros", () => {
        const a = new Float32Array([1, 2, 3, 4]);
        const b = new Float32Array([0, 0, 0, 0]);
        expect(matrix.add(a, b, 2, 2)).toEqual(new Float32Array([1, 2, 3, 4]));
    });

    test("should handle negative values", () => {
        const a = new Float32Array([1, -2, 3, -4]);
        const b = new Float32Array([-1, 2, -3, 4]);
        expect(matrix.add(a, b, 2, 2)).toEqual(new Float32Array([0, 0, 0, 0]));
    });

    test("should handle single element", () => {
        const a = new Float32Array([5]);
        const b = new Float32Array([3]);
        expect(matrix.add(a, b, 1, 1)).toEqual(new Float32Array([8]));
    });

    test("should throw on dimension mismatch", () => {
        const a = new Float32Array([1, 2, 3]);
        const b = new Float32Array([1, 2]);
        expect(() => matrix.add(a, b, 2, 2)).toThrow("Matrix dimensions mismatch");
    });
});

describe("matrix.sub", () => {
    test("should subtract two matrices", () => {
        const a = new Float32Array([5, 6, 7, 8]);
        const b = new Float32Array([1, 2, 3, 4]);
        expect(matrix.sub(a, b, 2, 2)).toEqual(new Float32Array([4, 4, 4, 4]));
    });

    test("should produce negative results", () => {
        const a = new Float32Array([1, 2, 3, 4]);
        const b = new Float32Array([5, 6, 7, 8]);
        expect(matrix.sub(a, b, 2, 2)).toEqual(new Float32Array([-4, -4, -4, -4]));
    });

    test("should handle single element", () => {
        const a = new Float32Array([10]);
        const b = new Float32Array([3]);
        expect(matrix.sub(a, b, 1, 1)).toEqual(new Float32Array([7]));
    });

    test("should throw on dimension mismatch", () => {
        const a = new Float32Array([1, 2]);
        const b = new Float32Array([1, 2, 3]);
        expect(() => matrix.sub(a, b, 1, 3)).toThrow("Matrix dimensions mismatch");
    });
});

describe("matrix.trace", () => {
    test("should compute trace of 2x2", () => {
        const a = new Float32Array([1, 2, 3, 4]);
        expect(matrix.trace(a, 2)).toBe(5);
    });

    test("should compute trace of 3x3", () => {
        const a = new Float32Array([1, 2, 3, 4, 5, 6, 7, 8, 9]);
        expect(matrix.trace(a, 3)).toBe(15);
    });

    test("should compute trace of 1x1", () => {
        const a = new Float32Array([42]);
        expect(matrix.trace(a, 1)).toBe(42);
    });

    test("should return 0 for zero matrix", () => {
        const a = new Float32Array([0, 0, 0, 0]);
        expect(matrix.trace(a, 2)).toBe(0);
    });

    test("should throw on non-square matrix", () => {
        const a = new Float32Array([1, 2, 3, 4, 5, 6]);
        expect(() => matrix.trace(a, 2)).toThrow("Matrix must be square");
    });
});

describe("matrix.eye", () => {
    test("should create 1x1 identity", () => {
        expect(matrix.eye(1)).toEqual(new Float32Array([1]));
    });

    test("should create 2x2 identity", () => {
        expect(matrix.eye(2)).toEqual(new Float32Array([1, 0, 0, 1]));
    });

    test("should create 3x3 identity", () => {
        expect(matrix.eye(3)).toEqual(
            new Float32Array([1, 0, 0, 0, 1, 0, 0, 0, 1])
        );
    });

    test("should throw on n = 0", () => {
        expect(() => matrix.eye(0)).toThrow("n must be a positive integer");
    });

    test("should throw on negative n", () => {
        expect(() => matrix.eye(-2)).toThrow("n must be a positive integer");
    });

    test("should throw on non-integer n", () => {
        expect(() => matrix.eye(2.5)).toThrow("n must be a positive integer");
    });
});

describe("matrix.scale", () => {
    test("should scale matrix by scalar", () => {
        expect(matrix.scale(new Float32Array([1, 2, 3, 4]), 3, 2, 2)).toEqual(new Float32Array([3, 6, 9, 12]));
    });

    test("should handle scale by zero", () => {
        expect(matrix.scale(new Float32Array([1, 2, 3, 4]), 0, 2, 2)).toEqual(new Float32Array([0, 0, 0, 0]));
    });

    test("should handle negative scalar", () => {
        expect(matrix.scale(new Float32Array([1, -2]), -1, 1, 2)).toEqual(new Float32Array([-1, 2]));
    });

    test("should throw on dimension mismatch", () => {
        expect(() => matrix.scale(new Float32Array([1, 2, 3]), 2, 2, 2)).toThrow("Matrix dimensions mismatch");
    });

    test("should not mutate original", () => {
        const a = new Float32Array([1, 2, 3, 4]);
        matrix.scale(a, 3, 2, 2);
        expect(a).toEqual(new Float32Array([1, 2, 3, 4]));
    });
});

describe("matrix.hadamard", () => {
    test("should compute element-wise product", () => {
        expect(matrix.hadamard(new Float32Array([1, 2, 3, 4]), new Float32Array([5, 6, 7, 8]), 2, 2)).toEqual(new Float32Array([5, 12, 21, 32]));
    });

    test("should return zeros when multiplied by zero matrix", () => {
        const a = new Float32Array([1, 2, 3, 4]);
        const zero = new Float32Array([0, 0, 0, 0]);
        expect(matrix.hadamard(a, zero, 2, 2)).toEqual(zero);
    });

    test("should throw on dimension mismatch", () => {
        expect(() => matrix.hadamard(new Float32Array([1, 2]), new Float32Array([1]), 2, 1)).toThrow("Matrix dimensions mismatch");
    });
});

describe("matrix.frobeniusNorm", () => {
    test("should compute Frobenius norm", () => {
        // sqrt(1+4+9+16) = sqrt(30)
        expect(matrix.frobeniusNorm(new Float32Array([1, 2, 3, 4]), 2, 2)).toBeCloseTo(Math.sqrt(30), 4);
    });

    test("should return 0 for zero matrix", () => {
        expect(matrix.frobeniusNorm(new Float32Array([0, 0, 0, 0]), 2, 2)).toBe(0);
    });

    test("should throw on dimension mismatch", () => {
        expect(() => matrix.frobeniusNorm(new Float32Array([1, 2, 3]), 2, 2)).toThrow("Matrix dimensions mismatch");
    });
});

describe("matrix.luDecompose", () => {
    test("should decompose 2x2 matrix", () => {
        const a = new Float32Array([2, 1, 4, 5]);
        const { l, u } = matrix.luDecompose(a, 2);
        expect(l).toBeInstanceOf(Float32Array);
        expect(u).toBeInstanceOf(Float32Array);
        expect(l.length).toBe(4);
        expect(u.length).toBe(4);
    });

    test("should throw on non-square matrix", () => {
        expect(() => matrix.luDecompose(new Float32Array([1, 2, 3, 4, 5, 6]), 2)).toThrow("Matrix must be square");
    });
});

describe("matrix.cholesky", () => {
    test("should decompose positive-definite matrix", () => {
        // [[4, 2], [2, 3]] is positive-definite
        const a = new Float32Array([4, 2, 2, 3]);
        const l = matrix.cholesky(a, 2);
        expect(l).toBeInstanceOf(Float32Array);
        expect(l.length).toBe(4);
    });

    test("should throw on non-square matrix", () => {
        expect(() => matrix.cholesky(new Float32Array([1, 2, 3, 4, 5, 6]), 2)).toThrow("Matrix must be square");
    });
});

describe("matrix.eigenvalues", () => {
    test("should compute eigenvalues of diagonal matrix", () => {
        const a = new Float32Array([3, 0, 0, 5]);
        const result = matrix.eigenvalues(a, 2);
        expect(result).toBeInstanceOf(Float32Array);
        expect(result.length).toBe(2);
        const sorted = Array.from(result).sort((a, b) => a - b);
        expect(sorted[0]).toBeCloseTo(3, 4);
        expect(sorted[1]).toBeCloseTo(5, 4);
    });

    test("should compute eigenvalues of identity", () => {
        const a = new Float32Array([1, 0, 0, 1]);
        const result = matrix.eigenvalues(a, 2);
        expect(result[0]).toBeCloseTo(1, 4);
        expect(result[1]).toBeCloseTo(1, 4);
    });

    test("should throw on non-square matrix", () => {
        expect(() => matrix.eigenvalues(new Float32Array([1, 2, 3, 4, 5, 6]), 2)).toThrow("Matrix must be square");
    });
});
