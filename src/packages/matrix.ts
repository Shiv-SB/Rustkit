import { nativeMatrix, ptr } from "../native";

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

export function eye(
    n: number
): Float32Array {
    const out = new Float32Array(n * n);

    nativeMatrix.symbols.rk_matrix_eye_f32(
        ptr(out),
        n
    );

    return out;
}

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
