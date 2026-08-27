import { describe, test, expect } from "bun:test";
import { string } from "../src/index";

describe("string.levenshtein", () => {
    test("should return 0 for identical strings", () => {
        expect(string.levenshtein("hello", "hello")).toBe(0);
    });

    test("should compute single insertion", () => {
        expect(string.levenshtein("cat", "cats")).toBe(1);
    });

    test("should compute single deletion", () => {
        expect(string.levenshtein("cats", "cat")).toBe(1);
    });

    test("should compute single substitution", () => {
        expect(string.levenshtein("cat", "bat")).toBe(1);
    });

    test("should compute multiple edits", () => {
        expect(string.levenshtein("kitten", "sitting")).toBe(3);
    });

    test("should handle empty strings", () => {
        expect(string.levenshtein("", "abc")).toBe(3);
    });

    test("should handle both empty", () => {
        expect(string.levenshtein("", "")).toBe(0);
    });

    test("should handle single character", () => {
        expect(string.levenshtein("a", "b")).toBe(1);
    });
});

describe("string.hamming", () => {
    test("should return 0 for identical strings", () => {
        expect(string.hamming("hello", "hello")).toBe(0);
    });

    test("should count differing characters", () => {
        expect(string.hamming("abc", "axc")).toBe(1);
    });

    test("should count all different", () => {
        expect(string.hamming("abc", "xyz")).toBe(3);
    });

    test("should handle single character", () => {
        expect(string.hamming("a", "a")).toBe(0);
    });

    test("should throw on different lengths", () => {
        expect(() => string.hamming("abc", "ab")).toThrow("Strings must have the same length");
    });

    test("should handle empty strings", () => {
        expect(string.hamming("", "")).toBe(0);
    });
});

describe("string.fuzzyMatch", () => {
    test("should find pattern in text", () => {
        expect(string.fuzzyMatch("abc", "axbycz")).not.toBeNull();
    });

    test("should return null when not found", () => {
        expect(string.fuzzyMatch("xyz", "abc")).toBeNull();
    });

    test("should match at start", () => {
        const result = string.fuzzyMatch("ab", "abcdef");
        expect(result).toBe(0);
    });

    test("should match at end", () => {
        const result = string.fuzzyMatch("ef", "abcdef");
        expect(result).toBe(4);
    });

    test("should handle empty pattern", () => {
        expect(string.fuzzyMatch("", "abc")).not.toBeNull();
    });

    test("should handle empty text", () => {
        expect(string.fuzzyMatch("a", "")).toBeNull();
    });

    test("should handle both empty", () => {
        expect(string.fuzzyMatch("", "")).not.toBeNull();
    });
});

describe("string.longestCommonSubseq", () => {
    test("should compute LCS", () => {
        expect(string.longestCommonSubseq("abcde", "ace")).toBe(3);
    });

    test("should return length of shorter when subset", () => {
        expect(string.longestCommonSubseq("abc", "abc")).toBe(3);
    });

    test("should return 0 for no common chars", () => {
        expect(string.longestCommonSubseq("abc", "xyz")).toBe(0);
    });

    test("should handle empty strings", () => {
        expect(string.longestCommonSubseq("", "abc")).toBe(0);
    });

    test("should handle both empty", () => {
        expect(string.longestCommonSubseq("", "")).toBe(0);
    });

    test("should handle single character match", () => {
        expect(string.longestCommonSubseq("a", "a")).toBe(1);
    });
});

describe("string.longestCommonSubstr", () => {
    test("should compute longest common substring", () => {
        expect(string.longestCommonSubstr("abcdxyz", "xyzabcd")).toBe(4);
    });

    test("should return full length for identical strings", () => {
        expect(string.longestCommonSubstr("abc", "abc")).toBe(3);
    });

    test("should return 0 for no common substring", () => {
        expect(string.longestCommonSubstr("abc", "xyz")).toBe(0);
    });

    test("should handle empty strings", () => {
        expect(string.longestCommonSubstr("", "abc")).toBe(0);
    });

    test("should handle both empty", () => {
        expect(string.longestCommonSubstr("", "")).toBe(0);
    });

    test("should handle single character match", () => {
        expect(string.longestCommonSubstr("a", "a")).toBe(1);
    });
});
