import { nativeBitset, ptr } from "../native";

export function create(numBits: number): BigUint64Array {
    const numWords = Math.ceil(numBits / 64);
    const bits = new BigUint64Array(numWords);

    nativeBitset.symbols.rk_bitset_new(ptr(bits), numWords);

    return bits;
}

export function set(bits: BigUint64Array, index: number): void {
    if (index < 0 || index >= bits.length * 64) {
        throw new Error("Index out of bounds");
    }

    nativeBitset.symbols.rk_bitset_set(ptr(bits), bits.length, index);
}

export function clear(bits: BigUint64Array, index: number): void {
    if (index < 0 || index >= bits.length * 64) {
        throw new Error("Index out of bounds");
    }

    nativeBitset.symbols.rk_bitset_clear(ptr(bits), bits.length, index);
}

export function toggle(bits: BigUint64Array, index: number): void {
    if (index < 0 || index >= bits.length * 64) {
        throw new Error("Index out of bounds");
    }

    nativeBitset.symbols.rk_bitset_toggle(ptr(bits), bits.length, index);
}

export function popcount(bits: BigUint64Array): number {
    return nativeBitset.symbols.rk_bitset_popcount(ptr(bits), bits.length);
}

export function and(
    a: BigUint64Array,
    b: BigUint64Array
): BigUint64Array {
    if (a.length !== b.length) {
        throw new Error("Bitsets must have the same length");
    }

    const out = new BigUint64Array(a.length);

    nativeBitset.symbols.rk_bitset_and(ptr(a), ptr(b), ptr(out), a.length);

    return out;
}

export function or(
    a: BigUint64Array,
    b: BigUint64Array
): BigUint64Array {
    if (a.length !== b.length) {
        throw new Error("Bitsets must have the same length");
    }

    const out = new BigUint64Array(a.length);

    nativeBitset.symbols.rk_bitset_or(ptr(a), ptr(b), ptr(out), a.length);

    return out;
}

export function xor(
    a: BigUint64Array,
    b: BigUint64Array
): BigUint64Array {
    if (a.length !== b.length) {
        throw new Error("Bitsets must have the same length");
    }

    const out = new BigUint64Array(a.length);

    nativeBitset.symbols.rk_bitset_xor(ptr(a), ptr(b), ptr(out), a.length);

    return out;
}

export function nextSetBit(
    bits: BigUint64Array,
    from: number
): number | null {
    const out = new Uint32Array(1);

    const found = nativeBitset.symbols.rk_bitset_next_set_bit(
        ptr(bits),
        bits.length,
        from,
        ptr(out)
    );

    return found ? out[0] : null;
}

export function cardinality(bits: BigUint64Array): number {
    return nativeBitset.symbols.rk_bitset_cardinality(ptr(bits), bits.length);
}
