import { nativeSort, ptr } from "../native";

export function quicksort(a: Int32Array): Int32Array {
    const out = new Int32Array(a);

    nativeSort.symbols.rk_sort_quicksort_i32(ptr(out), a.length);

    return out;
}

export function argsort(a: Float32Array): Uint32Array {
    const out = new Uint32Array(a.length);

    nativeSort.symbols.rk_sort_argsort_f32(ptr(a), ptr(out), a.length);

    return out;
}

export function isSorted(a: Int32Array): boolean {
    return nativeSort.symbols.rk_sort_is_sorted_i32(ptr(a), a.length);
}

export function selectKth(a: Int32Array, k: number): number {
    if (k < 0 || k >= a.length) {
        throw new Error("k must be within array bounds");
    }

    const out = new Int32Array(a);

    return nativeSort.symbols.rk_sort_select_kth_i32(ptr(out), a.length, k);
}
