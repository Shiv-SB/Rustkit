import { nativeBitset, ptr } from "../native";

/**
 * Creates an empty bitset with the given capacity.
 *
 * @param numBits - Number of bits in the set.
 * @returns A new zeroed BigUint64Array of length `ceil(numBits / 64)`.
 */
export function create(numBits: number): BigUint64Array {
    const numWords = Math.ceil(numBits / 64);
    const bits = new BigUint64Array(numWords);

    if (numWords > 0) {
        nativeBitset.symbols.rk_bitset_new(ptr(bits), numWords);
    }

    return bits;
}

/**
 * Sets a bit in the bitset to 1.
 *
 * @param bits - The bitset to modify.
 * @param index - Bit index to set.
 * @throws {Error} If `index` is outside `[0, bits.length * 64)`.
 */
export function set(bits: BigUint64Array, index: number): void {
    if (index < 0 || index >= bits.length * 64) {
        throw new Error("Index out of bounds");
    }

    nativeBitset.symbols.rk_bitset_set(ptr(bits), bits.length, index);
}

/**
 * Clears a bit in the bitset to 0.
 *
 * @param bits - The bitset to modify.
 * @param index - Bit index to clear.
 * @throws {Error} If `index` is outside `[0, bits.length * 64)`.
 */
export function clear(bits: BigUint64Array, index: number): void {
    if (index < 0 || index >= bits.length * 64) {
        throw new Error("Index out of bounds");
    }

    nativeBitset.symbols.rk_bitset_clear(ptr(bits), bits.length, index);
}

/**
 * Toggles a bit in the bitset (0 becomes 1, 1 becomes 0).
 *
 * @param bits - The bitset to modify.
 * @param index - Bit index to toggle.
 * @throws {Error} If `index` is outside `[0, bits.length * 64)`.
 */
export function toggle(bits: BigUint64Array, index: number): void {
    if (index < 0 || index >= bits.length * 64) {
        throw new Error("Index out of bounds");
    }

    nativeBitset.symbols.rk_bitset_toggle(ptr(bits), bits.length, index);
}

/**
 * Counts the number of set bits in the bitset.
 *
 * @param bits - The bitset to inspect.
 * @returns The number of 1 bits.
 */
export function popcount(bits: BigUint64Array): number {
    return nativeBitset.symbols.rk_bitset_popcount(ptr(bits), bits.length);
}

/**
 * Computes the element-wise AND of two bitsets.
 *
 * @param a - First bitset.
 * @param b - Second bitset.
 * @returns A new BigUint64Array containing `a[i] & b[i]` per word.
 * @throws {Error} If `a` and `b` have different lengths.
 */
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

/**
 * Computes the element-wise OR of two bitsets.
 *
 * @param a - First bitset.
 * @param b - Second bitset.
 * @returns A new BigUint64Array containing `a[i] | b[i]` per word.
 * @throws {Error} If `a` and `b` have different lengths.
 */
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

/**
 * Computes the element-wise XOR of two bitsets.
 *
 * @param a - First bitset.
 * @param b - Second bitset.
 * @returns A new BigUint64Array containing `a[i] ^ b[i]` per word.
 * @throws {Error} If `a` and `b` have different lengths.
 */
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

/**
 * Returns the index of the first set bit at or after `from`.
 *
 * @param bits - The bitset to search.
 * @param from - Starting bit index.
 * @returns The index of the next set bit, or `null` if none exists.
 */
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

    return found ? out[0]! : null;
}

/**
 * Counts the number of set bits in the bitset.
 *
 * @param bits - The bitset to inspect.
 * @returns The number of 1 bits.
 */
export function cardinality(bits: BigUint64Array): number {
    return Number(nativeBitset.symbols.rk_bitset_cardinality(ptr(bits), bits.length));
}
