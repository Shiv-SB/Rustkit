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

describe("crypto.aeadEncrypt", () => {
    const key = new Uint8Array(32);
    const nonce = new Uint8Array(12);

    test("should encrypt data", () => {
        const plaintext = new TextEncoder().encode("hello world");
        const ciphertext = crypto.aeadEncrypt(key, nonce, null, plaintext);
        expect(ciphertext).toBeInstanceOf(Uint8Array);
        expect(ciphertext.length).toBe(plaintext.length + 16);
    });

    test("should produce different ciphertext than plaintext", () => {
        const plaintext = new TextEncoder().encode("hello world");
        const ciphertext = crypto.aeadEncrypt(key, nonce, null, plaintext);
        expect(ciphertext).not.toEqual(plaintext);
    });

    test("should throw on wrong key length", () => {
        const shortKey = new Uint8Array(16);
        const plaintext = new TextEncoder().encode("test");
        expect(() => crypto.aeadEncrypt(shortKey, nonce, null, plaintext)).toThrow("Key must be 32 bytes");
    });

    test("should throw on wrong nonce length", () => {
        const shortNonce = new Uint8Array(6);
        const plaintext = new TextEncoder().encode("test");
        expect(() => crypto.aeadEncrypt(key, shortNonce, null, plaintext)).toThrow("Nonce must be 12 bytes");
    });

    test("should handle AAD", () => {
        const plaintext = new TextEncoder().encode("hello");
        const aad = new TextEncoder().encode("metadata");
        const ciphertext = crypto.aeadEncrypt(key, nonce, aad, plaintext);
        expect(ciphertext.length).toBe(plaintext.length + 16);
    });

    test("should handle null AAD", () => {
        const plaintext = new TextEncoder().encode("hello");
        const ciphertext = crypto.aeadEncrypt(key, nonce, null, plaintext);
        expect(ciphertext.length).toBe(plaintext.length + 16);
    });
});

describe("crypto.aeadDecrypt", () => {
    const key = new Uint8Array(32);
    const nonce = new Uint8Array(12);

    test("should decrypt ciphertext", () => {
        const plaintext = new TextEncoder().encode("hello world");
        const ciphertext = crypto.aeadEncrypt(key, nonce, null, plaintext);
        const decrypted = crypto.aeadDecrypt(key, nonce, null, ciphertext);
        expect(decrypted).toEqual(plaintext);
    });

    test("should throw on wrong key", () => {
        const plaintext = new TextEncoder().encode("hello");
        const ciphertext = crypto.aeadEncrypt(key, nonce, null, plaintext);
        const wrongKey = new Uint8Array(32);
        wrongKey[0] = 1;
        expect(() => crypto.aeadDecrypt(wrongKey, nonce, null, ciphertext)).toThrow("Decryption failed");
    });

    test("should throw on wrong nonce", () => {
        const plaintext = new TextEncoder().encode("hello");
        const ciphertext = crypto.aeadEncrypt(key, nonce, null, plaintext);
        const wrongNonce = new Uint8Array(12);
        wrongNonce[0] = 1;
        expect(() => crypto.aeadDecrypt(key, wrongNonce, null, ciphertext)).toThrow("Decryption failed");
    });

    test("should throw on wrong key length", () => {
        const shortKey = new Uint8Array(16);
        const ciphertext = new Uint8Array(32);
        expect(() => crypto.aeadDecrypt(shortKey, nonce, null, ciphertext)).toThrow("Key must be 32 bytes");
    });

    test("should throw on wrong nonce length", () => {
        const shortNonce = new Uint8Array(6);
        const ciphertext = new Uint8Array(32);
        expect(() => crypto.aeadDecrypt(key, shortNonce, null, ciphertext)).toThrow("Nonce must be 12 bytes");
    });

    test("should throw on ciphertext too short", () => {
        const shortCiphertext = new Uint8Array(8);
        expect(() => crypto.aeadDecrypt(key, nonce, null, shortCiphertext)).toThrow("Ciphertext too short");
    });

    test("should decrypt with AAD", () => {
        const plaintext = new TextEncoder().encode("hello");
        const aad = new TextEncoder().encode("metadata");
        const ciphertext = crypto.aeadEncrypt(key, nonce, aad, plaintext);
        const decrypted = crypto.aeadDecrypt(key, nonce, aad, ciphertext);
        expect(decrypted).toEqual(plaintext);
    });
});

describe("crypto.chacha20", () => {
    const key = new Uint8Array(32);
    const nonce = new Uint8Array(12);

    test("should encrypt data", () => {
        const input = new TextEncoder().encode("hello world");
        const output = crypto.chacha20(key, nonce, 0, input);
        expect(output).toBeInstanceOf(Uint8Array);
        expect(output.length).toBe(input.length);
    });

    test("should produce different output than input", () => {
        const input = new TextEncoder().encode("hello world");
        const output = crypto.chacha20(key, nonce, 0, input);
        expect(output).not.toEqual(input);
    });

    test("should be deterministic", () => {
        const input = new TextEncoder().encode("test");
        const r1 = crypto.chacha20(key, nonce, 0, input);
        const r2 = crypto.chacha20(key, nonce, 0, input);
        expect(r1).toEqual(r2);
    });

    test("should produce different output with different counter", () => {
        const input = new TextEncoder().encode("test");
        const r1 = crypto.chacha20(key, nonce, 0, input);
        const r2 = crypto.chacha20(key, nonce, 1, input);
        expect(r1).not.toEqual(r2);
    });

    test("should throw on wrong key length", () => {
        const shortKey = new Uint8Array(16);
        const input = new TextEncoder().encode("test");
        expect(() => crypto.chacha20(shortKey, nonce, 0, input)).toThrow("Key must be 32 bytes");
    });

    test("should throw on wrong nonce length", () => {
        const shortNonce = new Uint8Array(6);
        const input = new TextEncoder().encode("test");
        expect(() => crypto.chacha20(key, shortNonce, 0, input)).toThrow("Nonce must be 12 bytes");
    });

    test("should handle empty input", () => {
        const output = crypto.chacha20(key, nonce, 0, new Uint8Array([]));
        expect(output.length).toBe(0);
    });
});
