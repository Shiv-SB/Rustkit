import { describe, test, expect } from "bun:test";
import { bitset } from "../src/index";

describe("bitset.create", () => {
    test("should create bitset with specified bits", () => {
        const bits = bitset.create(64);
        expect(bits.length).toBe(1);
        expect(bits).toBeInstanceOf(BigUint64Array);
    });

    test("should create bitset requiring multiple words", () => {
        const bits = bitset.create(128);
        expect(bits.length).toBe(2);
    });

    test("should create empty bitset", () => {
        const bits = bitset.create(0);
        expect(bits.length).toBe(0);
    });

    test("should round up to next word boundary", () => {
        const bits = bitset.create(65);
        expect(bits.length).toBe(2);
    });
});

describe("bitset.set", () => {
    test("should set a bit", () => {
        const bits = bitset.create(64);
        bitset.set(bits, 0);
        expect(bitset.popcount(bits)).toBe(1);
    });

    test("should set multiple bits", () => {
        const bits = bitset.create(64);
        bitset.set(bits, 0);
        bitset.set(bits, 32);
        bitset.set(bits, 63);
        expect(bitset.popcount(bits)).toBe(3);
    });

    test("should be idempotent", () => {
        const bits = bitset.create(64);
        bitset.set(bits, 5);
        bitset.set(bits, 5);
        expect(bitset.popcount(bits)).toBe(1);
    });

    test("should throw on out of bounds", () => {
        const bits = bitset.create(64);
        expect(() => bitset.set(bits, 64)).toThrow("Index out of bounds");
    });

    test("should throw on negative index", () => {
        const bits = bitset.create(64);
        expect(() => bitset.set(bits, -1)).toThrow("Index out of bounds");
    });
});

describe("bitset.clear", () => {
    test("should clear a set bit", () => {
        const bits = bitset.create(64);
        bitset.set(bits, 5);
        bitset.clear(bits, 5);
        expect(bitset.popcount(bits)).toBe(0);
    });

    test("should be idempotent on cleared bit", () => {
        const bits = bitset.create(64);
        bitset.clear(bits, 5);
        bitset.clear(bits, 5);
        expect(bitset.popcount(bits)).toBe(0);
    });

    test("should throw on out of bounds", () => {
        const bits = bitset.create(64);
        expect(() => bitset.clear(bits, 64)).toThrow("Index out of bounds");
    });
});

describe("bitset.toggle", () => {
    test("should toggle off bit to on", () => {
        const bits = bitset.create(64);
        bitset.toggle(bits, 5);
        expect(bitset.popcount(bits)).toBe(1);
    });

    test("should toggle on bit to off", () => {
        const bits = bitset.create(64);
        bitset.set(bits, 5);
        bitset.toggle(bits, 5);
        expect(bitset.popcount(bits)).toBe(0);
    });

    test("should toggle back to original state", () => {
        const bits = bitset.create(64);
        bitset.toggle(bits, 5);
        bitset.toggle(bits, 5);
        expect(bitset.popcount(bits)).toBe(0);
    });

    test("should throw on out of bounds", () => {
        const bits = bitset.create(64);
        expect(() => bitset.toggle(bits, 64)).toThrow("Index out of bounds");
    });
});

describe("bitset.popcount", () => {
    test("should return 0 for empty bitset", () => {
        const bits = bitset.create(64);
        expect(bitset.popcount(bits)).toBe(0);
    });

    test("should count set bits", () => {
        const bits = bitset.create(64);
        bitset.set(bits, 0);
        bitset.set(bits, 1);
        bitset.set(bits, 2);
        expect(bitset.popcount(bits)).toBe(3);
    });

    test("should count across word boundaries", () => {
        const bits = bitset.create(128);
        bitset.set(bits, 0);
        bitset.set(bits, 63);
        bitset.set(bits, 64);
        bitset.set(bits, 127);
        expect(bitset.popcount(bits)).toBe(4);
    });
});

describe("bitset.and", () => {
    test("should compute intersection", () => {
        const a = bitset.create(64);
        const b = bitset.create(64);
        bitset.set(a, 0);
        bitset.set(a, 1);
        bitset.set(a, 2);
        bitset.set(b, 1);
        bitset.set(b, 2);
        bitset.set(b, 3);
        const result = bitset.and(a, b);
        expect(bitset.popcount(result)).toBe(2);
    });

    test("should return empty for disjoint sets", () => {
        const a = bitset.create(64);
        const b = bitset.create(64);
        bitset.set(a, 0);
        bitset.set(b, 1);
        const result = bitset.and(a, b);
        expect(bitset.popcount(result)).toBe(0);
    });

    test("should return same when identical", () => {
        const a = bitset.create(64);
        bitset.set(a, 0);
        bitset.set(a, 1);
        const result = bitset.and(a, a);
        expect(bitset.popcount(result)).toBe(2);
    });

    test("should throw on mismatched lengths", () => {
        const a = bitset.create(64);
        const b = bitset.create(128);
        expect(() => bitset.and(a, b)).toThrow("Bitsets must have the same length");
    });
});

describe("bitset.or", () => {
    test("should compute union", () => {
        const a = bitset.create(64);
        const b = bitset.create(64);
        bitset.set(a, 0);
        bitset.set(a, 1);
        bitset.set(b, 1);
        bitset.set(b, 2);
        const result = bitset.or(a, b);
        expect(bitset.popcount(result)).toBe(3);
    });

    test("should return same for disjoint sets", () => {
        const a = bitset.create(64);
        const b = bitset.create(64);
        bitset.set(a, 0);
        bitset.set(b, 1);
        const result = bitset.or(a, b);
        expect(bitset.popcount(result)).toBe(2);
    });

    test("should throw on mismatched lengths", () => {
        const a = bitset.create(64);
        const b = bitset.create(128);
        expect(() => bitset.or(a, b)).toThrow("Bitsets must have the same length");
    });
});

describe("bitset.xor", () => {
    test("should compute symmetric difference", () => {
        const a = bitset.create(64);
        const b = bitset.create(64);
        bitset.set(a, 0);
        bitset.set(a, 1);
        bitset.set(b, 1);
        bitset.set(b, 2);
        const result = bitset.xor(a, b);
        expect(bitset.popcount(result)).toBe(2);
    });

    test("should return empty for identical sets", () => {
        const a = bitset.create(64);
        bitset.set(a, 0);
        bitset.set(a, 1);
        const result = bitset.xor(a, a);
        expect(bitset.popcount(result)).toBe(0);
    });

    test("should throw on mismatched lengths", () => {
        const a = bitset.create(64);
        const b = bitset.create(128);
        expect(() => bitset.xor(a, b)).toThrow("Bitsets must have the same length");
    });
});

describe("bitset.nextSetBit", () => {
    test("should find first set bit", () => {
        const bits = bitset.create(64);
        bitset.set(bits, 5);
        expect(bitset.nextSetBit(bits, 0)).toBe(5);
    });

    test("should find next set bit from position", () => {
        const bits = bitset.create(64);
        bitset.set(bits, 3);
        bitset.set(bits, 7);
        expect(bitset.nextSetBit(bits, 4)).toBe(7);
    });

    test("should return null when no more set bits", () => {
        const bits = bitset.create(64);
        bitset.set(bits, 3);
        expect(bitset.nextSetBit(bits, 4)).toBeNull();
    });

    test("should return null for empty bitset", () => {
        const bits = bitset.create(64);
        expect(bitset.nextSetBit(bits, 0)).toBeNull();
    });

    test("should find across word boundaries", () => {
        const bits = bitset.create(128);
        bitset.set(bits, 70);
        expect(bitset.nextSetBit(bits, 0)).toBe(70);
    });
});

describe("bitset.cardinality", () => {
    test("should return 0 for empty bitset", () => {
        const bits = bitset.create(64);
        expect(bitset.cardinality(bits)).toBe(0);
    });

    test("should return count of set bits", () => {
        const bits = bitset.create(64);
        bitset.set(bits, 0);
        bitset.set(bits, 1);
        bitset.set(bits, 2);
        expect(bitset.cardinality(bits)).toBe(3);
    });

    test("should update after mutations", () => {
        const bits = bitset.create(64);
        bitset.set(bits, 0);
        expect(bitset.cardinality(bits)).toBe(1);
        bitset.set(bits, 0);
        expect(bitset.cardinality(bits)).toBe(1);
        bitset.clear(bits, 0);
        expect(bitset.cardinality(bits)).toBe(0);
    });
});
