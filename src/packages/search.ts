import { native, ptr } from "../native";

export function binarySearch(
    a: Int32Array,
    target: number
): number | null {
    const out = new Uint32Array(1);

    const found = native.symbols.rk_search_binary_search_i32(
        ptr(a),
        a.length,
        target,
        ptr(out)
    );

    return found ? out[0] : null;
}

export function lowerBound(
    a: Int32Array,
    target: number
): number {
    return native.symbols.rk_search_lower_bound_i32(
        ptr(a),
        a.length,
        target
    );
}

export function upperBound(
    a: Int32Array,
    target: number
): number {
    return native.symbols.rk_search_upper_bound_i32(
        ptr(a),
        a.length,
        target
    );
}

export function linearSearch(
    a: Int32Array,
    target: number
): number | null {
    const out = new Uint32Array(1);

    const found = native.symbols.rk_search_linear_search_i32(
        ptr(a),
        a.length,
        target,
        ptr(out)
    );

    return found ? out[0] : null;
}
