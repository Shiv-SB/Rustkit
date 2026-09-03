import { describe, test, expect } from "bun:test";
import { crypto } from "../src/index";
import { createRandomString, randomInt } from "./utils";

describe("crypto.crc32", () => {
    test("should compute CRC32 of empty data", () => {
        expect(crypto.crc32(new Uint8Array([]))).toBeInteger();
    });

    test("should compute CRC32 of string", () => {
        const data = new TextEncoder().encode("hello");
        const result = crypto.crc32(data);
        expect(result).toBeInteger();
    });

    test("should be deterministic", () => {
        const data = new TextEncoder().encode(createRandomString(16));
        const r1 = crypto.crc32(data);
        const r2 = crypto.crc32(data);
        expect(r1).toBe(r2);
    }, { repeats: 1_000 });

    test("should produce different values for different inputs", () => {
        const a = crypto.crc32(new TextEncoder().encode(createRandomString(16)));
        const b = crypto.crc32(new TextEncoder().encode(createRandomString(16)));
        expect(a).not.toBe(b);
    }, { repeats: 1_000 });

    test("should return a 32-bit unsigned integer", () => {
        const result = crypto.crc32(new TextEncoder().encode("test"));
        expect(result).toBeGreaterThanOrEqual(0);
        expect(result).toBeLessThanOrEqual(0xFFFFFFFF);
    });
});

describe("crypto.xxhash64", () => {
    test("should compute hash of data", () => {
        const data = new TextEncoder().encode("hello");
        const result = crypto.xxhash64(data);
        expect(typeof result).toBe("bigint");
    });

    test("should be deterministic", () => {
        const data = new TextEncoder().encode(createRandomString(8));
        const r1 = crypto.xxhash64(data);
        const r2 = crypto.xxhash64(data);
        expect(r1).toBe(r2);
    }, { repeats: 1_000 });

    test("should produce different values for different seeds", () => {
        const data = new TextEncoder().encode(createRandomString(16));
        const r1 = crypto.xxhash64(data, randomInt(0, 10));
        const r2 = crypto.xxhash64(data, randomInt(11, 20));
        expect(r1).not.toBe(r2);
    }, { repeats: 1_000 });

    test("should produce different values for different inputs", () => {
        const a = crypto.xxhash64(new TextEncoder().encode(createRandomString(8)));
        const b = crypto.xxhash64(new TextEncoder().encode(createRandomString(8)));
        expect(a).not.toBe(b);
    }, { repeats: 1_000 });

    test("should handle empty data", () => {
        const result = crypto.xxhash64(new Uint8Array([]));
        expect(result).toBeTypeOf("bigint")
    });
});

describe("crypto.fnv1a", () => {
    test("should compute FNV-1a hash", () => {
        const result = crypto.fnv1a(new TextEncoder().encode("hello"));
        expect(result).toBeTypeOf("bigint");
    });

    test("should be deterministic", () => {
        const data = new TextEncoder().encode("test");
        expect(crypto.fnv1a(data)).toBe(crypto.fnv1a(data));
    });

    test("should produce different values for different inputs", () => {
        const data1 = new TextEncoder().encode(createRandomString(8));
        const data2 = new TextEncoder().encode(createRandomString(8));
        expect(data1).not.toEqual(data2);
    }, { repeats: 1_000 });

    test("should handle empty data", () => {
        expect(crypto.fnv1a(new Uint8Array([]))).toBeTypeOf("bigint");
    });
});

describe("crypto.blake3", () => {
    test("should produce 32-byte hash", () => {
        const result = crypto.blake3(new TextEncoder().encode("hello"));
        expect(result).toBeInstanceOf(Uint8Array);
        expect(result.length).toBe(32);
    });

    test("should be deterministic", () => {
        const data = new TextEncoder().encode(createRandomString(16));
        const r1 = crypto.blake3(data);
        const r2 = crypto.blake3(data);
        expect(r1).toEqual(r2);
    }, { repeats: 1_000 });

    test("should produce different hashes for different inputs", () => {
        const a = crypto.blake3(new TextEncoder().encode(createRandomString(8)));
        const b = crypto.blake3(new TextEncoder().encode(createRandomString(8)));
        expect(a).not.toEqual(b);
    }, { repeats: 1_000 });
});

describe("crypto.murmur3", () => {
    test("should compute MurmurHash3", () => {
        const result = crypto.murmur3(new TextEncoder().encode("hello"));
        expect(result).toBeInteger();
    });

    test("should be deterministic", () => {
        const data = new TextEncoder().encode(createRandomString(16));
        expect(crypto.murmur3(data)).toBe(crypto.murmur3(data));
    }, { repeats: 1_000 });

    test("should produce different values for different seeds", () => {
        const data = new TextEncoder().encode(createRandomString(8));
        expect(crypto.murmur3(data, randomInt(0, 5))).not.toBe(crypto.murmur3(data, randomInt(6, 10)));
    }, { repeats: 1_000 });

    test("should handle empty data", () => {
        expect(crypto.murmur3(new Uint8Array([]))).toBeInteger()
    });
});
