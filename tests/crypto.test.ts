import { describe, test, expect } from "bun:test";
import { crypto } from "../src/index";

describe("crypto.crc32", () => {
    test("should compute CRC32 of empty data", () => {
        expect(typeof crypto.crc32(new Uint8Array([]))).toBe("number");
    });

    test("should compute CRC32 of string", () => {
        const data = new TextEncoder().encode("hello");
        const result = crypto.crc32(data);
        expect(typeof result).toBe("number");
    });

    test("should be deterministic", () => {
        const data = new TextEncoder().encode("test");
        const r1 = crypto.crc32(data);
        const r2 = crypto.crc32(data);
        expect(r1).toBe(r2);
    });

    test("should produce different values for different inputs", () => {
        const a = crypto.crc32(new TextEncoder().encode("hello"));
        const b = crypto.crc32(new TextEncoder().encode("world"));
        expect(a).not.toBe(b);
    });

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
        const data = new TextEncoder().encode("test");
        const r1 = crypto.xxhash64(data);
        const r2 = crypto.xxhash64(data);
        expect(r1).toBe(r2);
    });

    test("should produce different values for different seeds", () => {
        const data = new TextEncoder().encode("test");
        const r1 = crypto.xxhash64(data, 0);
        const r2 = crypto.xxhash64(data, 1);
        expect(r1).not.toBe(r2);
    });

    test("should produce different values for different inputs", () => {
        const a = crypto.xxhash64(new TextEncoder().encode("hello"));
        const b = crypto.xxhash64(new TextEncoder().encode("world"));
        expect(a).not.toBe(b);
    });

    test("should handle empty data", () => {
        const result = crypto.xxhash64(new Uint8Array([]));
        expect(typeof result).toBe("bigint");
    });
});

describe("crypto.fnv1a", () => {
    test("should compute FNV-1a hash", () => {
        const result = crypto.fnv1a(new TextEncoder().encode("hello"));
        expect(typeof result).toBe("bigint");
    });

    test("should be deterministic", () => {
        const data = new TextEncoder().encode("test");
        expect(crypto.fnv1a(data)).toBe(crypto.fnv1a(data));
    });

    test("should produce different values for different inputs", () => {
        expect(crypto.fnv1a(new TextEncoder().encode("hello"))).not.toBe(crypto.fnv1a(new TextEncoder().encode("world")));
    });

    test("should handle empty data", () => {
        expect(typeof crypto.fnv1a(new Uint8Array([]))).toBe("bigint");
    });
});

describe("crypto.blake3", () => {
    test("should produce 32-byte hash", () => {
        const result = crypto.blake3(new TextEncoder().encode("hello"));
        expect(result).toBeInstanceOf(Uint8Array);
        expect(result.length).toBe(32);
    });

    test("should be deterministic", () => {
        const data = new TextEncoder().encode("test");
        const r1 = crypto.blake3(data);
        const r2 = crypto.blake3(data);
        expect(r1).toEqual(r2);
    });

    test("should produce different hashes for different inputs", () => {
        const a = crypto.blake3(new TextEncoder().encode("hello"));
        const b = crypto.blake3(new TextEncoder().encode("world"));
        expect(a).not.toEqual(b);
    });
});

describe("crypto.murmur3", () => {
    test("should compute MurmurHash3", () => {
        const result = crypto.murmur3(new TextEncoder().encode("hello"));
        expect(typeof result).toBe("number");
    });

    test("should be deterministic", () => {
        const data = new TextEncoder().encode("test");
        expect(crypto.murmur3(data)).toBe(crypto.murmur3(data));
    });

    test("should produce different values for different seeds", () => {
        const data = new TextEncoder().encode("test");
        expect(crypto.murmur3(data, 0)).not.toBe(crypto.murmur3(data, 1));
    });

    test("should handle empty data", () => {
        expect(typeof crypto.murmur3(new Uint8Array([]))).toBe("number");
    });
});
