import { nativeMatrix, ptr } from "../native";

/**
 * Multiplies two row-major matrices with explicit dimensions.
 *
 * @param a - First matrix (rowsA x colsA).
 * @param b - Second matrix (colsA x colsB).
 * @param rowsA - Number of rows in `a`.
 * @param colsA - Number of columns in `a` / rows in `b`.
 * @param colsB - Number of columns in `b`.
 * @returns A new Float32Array of length `rowsA * colsB` containing
 * the product.
 * @throws {Error} If the flattened lengths of `a` or `b` do not match
 * the given dimensions.
 */
export function mul(
    a: Float32Array,
    b: Float32Array,
    rowsA: number,
    colsA: number,
    colsB: number
): Float32Array {
    if (a.length !== rowsA * colsA) {
        throw new Error("Matrix A dimensions mismatch");
    }
    if (b.length !== colsA * colsB) {
        throw new Error("Matrix B dimensions mismatch");
    }

    const out = new Float32Array(rowsA * colsB);

    nativeMatrix.symbols.rk_matrix_mul_f32(
        ptr(a),
        ptr(b),
        ptr(out),
        rowsA,
        colsA,
        colsB
    );

    return out;
}

/**
 * Transposes a row-major matrix.
 *
 * @param a - Input matrix (rows x cols).
 * @param rows - Number of rows.
 * @param cols - Number of columns.
 * @returns A new Float32Array containing the transposed matrix.
 * @throws {Error} If `a.length` does not equal `rows * cols`.
 */
export function transpose(
    a: Float32Array,
    rows: number,
    cols: number
): Float32Array {
    if (a.length !== rows * cols) {
        throw new Error("Matrix dimensions mismatch");
    }

    const out = new Float32Array(rows * cols);

    nativeMatrix.symbols.rk_matrix_transpose_f32(
        ptr(a),
        ptr(out),
        rows,
        cols
    );

    return out;
}

/**
 * Computes the determinant of a square matrix.
 *
 * @param a - Input matrix (n x n).
 * @param n - Matrix dimension.
 * @returns The determinant.
 * @throws {Error} If `a` is not an `n x n` square matrix.
 */
export function determinant(
    a: Float32Array,
    n: number
): number {
    if (a.length !== n * n) {
        throw new Error("Matrix must be square");
    }

    return nativeMatrix.symbols.rk_matrix_determinant_f32(
        ptr(a),
        n
    );
}

/**
 * Computes the inverse of a square matrix.
 *
 * @param a - Input matrix (n x n).
 * @param n - Matrix dimension.
 * @returns A new Float32Array containing the inverse.
 * @throws {Error} If `a` is not an `n x n` square matrix or is singular.
 */
export function inverse(
    a: Float32Array,
    n: number
): Float32Array {
    if (a.length !== n * n) {
        throw new Error("Matrix must be square");
    }

    const out = new Float32Array(n * n);

    const success = nativeMatrix.symbols.rk_matrix_inverse_f32(
        ptr(a),
        ptr(out),
        n
    );

    if (!success) {
        throw new Error("Matrix is singular and cannot be inverted");
    }

    return out;
}

/**
 * Adds two matrices element-wise.
 *
 * @param a - First matrix (rows x cols).
 * @param b - Second matrix (rows x cols).
 * @param rows - Number of rows.
 * @param cols - Number of columns.
 * @returns A new Float32Array containing the element-wise sum.
 * @throws {Error} If either matrix length does not equal `rows * cols`.
 */
export function add(
    a: Float32Array,
    b: Float32Array,
    rows: number,
    cols: number
): Float32Array {
    if (a.length !== rows * cols || b.length !== rows * cols) {
        throw new Error("Matrix dimensions mismatch");
    }

    const out = new Float32Array(rows * cols);

    nativeMatrix.symbols.rk_matrix_add_f32(
        ptr(a),
        ptr(b),
        ptr(out),
        rows,
        cols
    );

    return out;
}

/**
 * Subtracts two matrices element-wise.
 *
 * @param a - First matrix (rows x cols).
 * @param b - Second matrix (rows x cols).
 * @param rows - Number of rows.
 * @param cols - Number of columns.
 * @returns A new Float32Array containing `a[i] - b[i]` for each element.
 * @throws {Error} If either matrix length does not equal `rows * cols`.
 */
export function sub(
    a: Float32Array,
    b: Float32Array,
    rows: number,
    cols: number
): Float32Array {
    if (a.length !== rows * cols || b.length !== rows * cols) {
        throw new Error("Matrix dimensions mismatch");
    }

    const out = new Float32Array(rows * cols);

    nativeMatrix.symbols.rk_matrix_sub_f32(
        ptr(a),
        ptr(b),
        ptr(out),
        rows,
        cols
    );

    return out;
}

/**
 * Computes the trace (sum of the diagonal elements) of a square matrix.
 *
 * @param a - Input matrix (n x n).
 * @param n - Matrix dimension.
 * @returns The trace `sum(a[i * n + i])`.
 * @throws {Error} If `a` is not an `n x n` square matrix.
 */
export function trace(
    a: Float32Array,
    n: number
): number {
    if (a.length !== n * n) {
        throw new Error("Matrix must be square");
    }

    return nativeMatrix.symbols.rk_matrix_trace_f32(
        ptr(a),
        n
    );
}

/**
 * Creates an `n x n` identity matrix.
 *
 * @param n - Matrix dimension, a positive integer.
 * @returns A new Float32Array with 1s on the diagonal and 0s elsewhere.
 * @throws {Error} If `n` is not a positive integer.
 */
export function eye(
    n: number
): Float32Array {
    if (!Number.isInteger(n) || n <= 0) {
        throw new Error("n must be a positive integer");
    }

    const out = new Float32Array(n * n);

    nativeMatrix.symbols.rk_matrix_eye_f32(
        ptr(out),
        n
    );

    return out;
}

/**
 * Multiplies every element of a matrix by a scalar.
 *
 * @param a - Input matrix (rows x cols).
 * @param scalar - Scalar multiplier.
 * @param rows - Number of rows.
 * @param cols - Number of columns.
 * @returns A new Float32Array containing `a[i] * scalar` for each element.
 * @throws {Error} If `a.length` does not equal `rows * cols`.
 */
export function scale(
    a: Float32Array,
    scalar: number,
    rows: number,
    cols: number
): Float32Array {
    if (a.length !== rows * cols) {
        throw new Error("Matrix dimensions mismatch");
    }

    const out = new Float32Array(rows * cols);

    nativeMatrix.symbols.rk_matrix_scale_f32(
        ptr(a),
        scalar,
        ptr(out),
        rows,
        cols
    );

    return out;
}

/**
 * Computes the Hadamard (element-wise) product of two matrices.
 *
 * @param a - First matrix (rows x cols).
 * @param b - Second matrix (rows x cols).
 * @param rows - Number of rows.
 * @param cols - Number of columns.
 * @returns A new Float32Array containing `a[i] * b[i]` for each element.
 * @throws {Error} If either matrix length does not equal `rows * cols`.
 */
export function hadamard(
    a: Float32Array,
    b: Float32Array,
    rows: number,
    cols: number
): Float32Array {
    if (a.length !== rows * cols || b.length !== rows * cols) {
        throw new Error("Matrix dimensions mismatch");
    }

    const out = new Float32Array(rows * cols);

    nativeMatrix.symbols.rk_matrix_hadamard_f32(
        ptr(a),
        ptr(b),
        ptr(out),
        rows,
        cols
    );

    return out;
}

/**
 * Computes the Frobenius norm of a matrix: `sqrt(sum(a[i]^2))`.
 *
 * @param a - Input matrix (rows x cols).
 * @param rows - Number of rows.
 * @param cols - Number of columns.
 * @returns The Frobenius norm.
 * @throws {Error} If `a.length` does not equal `rows * cols`.
 */
export function frobeniusNorm(
    a: Float32Array,
    rows: number,
    cols: number
): number {
    if (a.length !== rows * cols) {
        throw new Error("Matrix dimensions mismatch");
    }

    return nativeMatrix.symbols.rk_matrix_frobenius_norm_f32(
        ptr(a),
        rows,
        cols
    );
}

/**
 * Computes the LU decomposition of a square matrix.
 *
 * @param a - Input matrix (n x n).
 * @param n - Matrix dimension.
 * @returns The lower and upper triangular factors `{ l, u }`, each an
 * `n x n` Float32Array.
 * @throws {Error} If `a` is not an `n x n` square matrix or cannot be
 * decomposed.
 */
export function luDecompose(
    a: Float32Array,
    n: number
): { l: Float32Array; u: Float32Array } {
    if (a.length !== n * n) {
        throw new Error("Matrix must be square");
    }

    const l = new Float32Array(n * n);
    const u = new Float32Array(n * n);

    const success = nativeMatrix.symbols.rk_matrix_lu_decompose_f32(
        ptr(a),
        ptr(l),
        ptr(u),
        n
    );

    if (!success) {
        throw new Error("Matrix cannot be LU decomposed");
    }

    return { l, u };
}

/**
 * Computes the Cholesky decomposition of a symmetric positive-definite
 * matrix.
 *
 * @param a - Input matrix (n x n).
 * @param n - Matrix dimension.
 * @returns A new Float32Array containing the lower triangular factor `L`
 * such that `a = L * L^T`.
 * @throws {Error} If `a` is not an `n x n` square matrix or is not
 * positive-definite.
 */
export function cholesky(
    a: Float32Array,
    n: number
): Float32Array {
    if (a.length !== n * n) {
        throw new Error("Matrix must be square");
    }

    const out = new Float32Array(n * n);

    const success = nativeMatrix.symbols.rk_matrix_cholesky_f32(
        ptr(a),
        ptr(out),
        n
    );

    if (!success) {
        throw new Error("Matrix is not positive-definite");
    }

    return out;
}

/**
 * Computes the eigenvalues of a square matrix.
 *
 * @param a - Input matrix (n x n).
 * @param n - Matrix dimension.
 * @returns A new Float32Array of length `n` containing the eigenvalues.
 * @throws {Error} If `a` is not an `n x n` square matrix or the
 * computation fails to converge.
 */
export function eigenvalues(
    a: Float32Array,
    n: number
): Float32Array {
    if (a.length !== n * n) {
        throw new Error("Matrix must be square");
    }

    const out = new Float32Array(n);

    const success = nativeMatrix.symbols.rk_matrix_eigenvalues_f32(
        ptr(a),
        ptr(out),
        n
    );

    if (!success) {
        throw new Error("Eigenvalue computation failed");
    }

    return out;
}
