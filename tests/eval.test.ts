import { describe, test, expect } from "bun:test";
import * as rustkit from "../src/index";

const { eval: llm } = rustkit;

describe("eval.perplexity", () => {
    test("should be 2 for a uniform binary distribution", () => {
        const logProbs = new Float32Array([Math.log(0.5), Math.log(0.5)]);
        expect(llm.perplexity(logProbs)).toBeCloseTo(2, 4);
    });

    test("should be 1 for a deterministic token", () => {
        expect(llm.perplexity(new Float32Array([0]))).toBeCloseTo(1, 4);
    });

    test("should be 4 for a uniform 4-way distribution", () => {
        const logProbs = new Float32Array([Math.log(0.25), Math.log(0.25), Math.log(0.25), Math.log(0.25)]);
        expect(llm.perplexity(logProbs)).toBeCloseTo(4, 4);
    });

    test("should throw on empty input", () => {
        expect(() => llm.perplexity(new Float32Array([]))).toThrow("Vector must not be empty");
    });
});

describe("eval.bleu", () => {
    test("should be 1 for identical strings", () => {
        expect(llm.bleu("the cat sat on the mat", "the cat sat on the mat")).toBeCloseTo(1, 4);
    });

    test("should be 0 when nothing overlaps", () => {
        expect(llm.bleu("hello world", "goodbye moon")).toBeCloseTo(0, 4);
    });

    test("should be 0.75 for a 3/4 unigram match with no brevity penalty", () => {
        expect(llm.bleu("a b c", "a b c d", 1)).toBeCloseTo(0.75, 4);
    });

    test("should throw on invalid maxN", () => {
        expect(() => llm.bleu("a", "a", 0)).toThrow("maxN must be a positive integer");
    });
});

describe("eval.rougeL", () => {
    test("should be 1 for identical strings", () => {
        expect(llm.rougeL("the cat sat on the mat", "the cat sat on the mat")).toBeCloseTo(1, 4);
    });

    test("should be 5/6 for a one-token substitution", () => {
        expect(llm.rougeL("the cat sat on the mat", "the cat sat on a mat")).toBeCloseTo(5 / 6, 4);
    });

    test("should be 0 when nothing overlaps", () => {
        expect(llm.rougeL("a b c", "x y z")).toBeCloseTo(0, 4);
    });
});

describe("eval.tokenF1", () => {
    test("should be 1 for identical token sequences", () => {
        expect(llm.tokenF1(new Int32Array([1, 2, 3]), new Int32Array([1, 2, 3]))).toBeCloseTo(1, 4);
    });

    test("should be 0 for disjoint token sequences", () => {
        expect(llm.tokenF1(new Int32Array([1, 2, 3]), new Int32Array([4, 5, 6]))).toBeCloseTo(0, 4);
    });

    test("should be 6/7 for a 3/4-precision, full-recall overlap", () => {
        expect(llm.tokenF1(new Int32Array([1, 2, 3]), new Int32Array([1, 2, 3, 4]))).toBeCloseTo(6 / 7, 4);
    });

    test("should throw on empty input", () => {
        expect(() => llm.tokenF1(new Int32Array([]), new Int32Array([1]))).toThrow("Token arrays must not be empty");
    });
});

describe("eval.exactMatch", () => {
    test("should be true for identical strings", () => {
        expect(llm.exactMatch("hello world", "hello world")).toBe(true);
    });

    test("should be false for different strings", () => {
        expect(llm.exactMatch("hello world", "hello there")).toBe(false);
    });
});