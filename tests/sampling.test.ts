import { describe, test, expect } from "bun:test";
import { sampling } from "../src/index";

describe("sampling.softmax", () => {
    test("should return probabilities that sum to 1", () => {
        const out = sampling.softmax(new Float32Array([1, 2, 3]));
        const sum = Array.from(out).reduce((s, x) => s + x, 0);
        expect(sum).toBeCloseTo(1, 4);
    }, { repeats: 100 });

    test("should preserve ordering and match known values", () => {
        const out = sampling.softmax(new Float32Array([1, 2, 3]));
        expect(out[0]!).toBeLessThan(out[1]!);
        expect(out[1]!).toBeLessThan(out[2]!);
        expect(out[0]).toBeCloseTo(0.0900, 4);
        expect(out[1]).toBeCloseTo(0.2447, 4);
        expect(out[2]).toBeCloseTo(0.6652, 4);
    });

    test("should be numerically stable for large logits", () => {
        const out = sampling.softmax(new Float32Array([1000, 1010, 990]));
        expect(out[1]).toBeCloseTo(1, 2);
        expect(Array.from(out).every((x) => Number.isFinite(x))).toBe(true);
    });

    test("should not mutate the input", () => {
        const logits = new Float32Array([1, 2, 3]);
        const copy = new Float32Array(logits);
        sampling.softmax(logits);
        expect(logits).toEqual(copy);
    });

    test("should throw on empty input", () => {
        expect(() => sampling.softmax(new Float32Array([]))).toThrow("Vector must not be empty");
    });
});

describe("sampling.logSoftmax", () => {
    test("should equal the log of softmax", () => {
        const logits = new Float32Array([1, 2, 3]);
        const logProbs = sampling.logSoftmax(logits);
        const probs = sampling.softmax(logits);
        expect(Math.exp(logProbs[0]!)).toBeCloseTo(probs[0]!, 4);
        expect(Math.exp(logProbs[1]!)).toBeCloseTo(probs[1]!, 4);
        expect(Math.exp(logProbs[2]!)).toBeCloseTo(probs[2]!, 4);
    });

    test("should be numerically stable for large logits", () => {
        const out = sampling.logSoftmax(new Float32Array([1000, 1010, 990]));
        expect(out[1]).toBeCloseTo(0, 2);
        expect(Array.from(out).every((x) => Number.isFinite(x))).toBe(true);
    });

    test("should throw on empty input", () => {
        expect(() => sampling.logSoftmax(new Float32Array([]))).toThrow("Vector must not be empty");
    });
});

describe("sampling.temperature", () => {
    test("should scale logits by 1/t", () => {
        const out = sampling.temperature(new Float32Array([1, 2, 3]), 2);
        expect(Array.from(out)).toEqual([0.5, 1, 1.5]);
    });

    test("should sharpen with temperature < 1", () => {
        const out = sampling.temperature(new Float32Array([1, 2, 3]), 0.5);
        expect(Array.from(out)).toEqual([2, 4, 6]);
    });

    test("should be the identity for temperature 1", () => {
        const out = sampling.temperature(new Float32Array([1, 2, 3]), 1);
        expect(Array.from(out)).toEqual([1, 2, 3]);
    });

    test("should not mutate the input", () => {
        const logits = new Float32Array([1, 2, 3]);
        const copy = new Float32Array(logits);
        sampling.temperature(logits, 2);
        expect(logits).toEqual(copy);
    });

    test("should throw on non-positive temperature", () => {
        expect(() => sampling.temperature(new Float32Array([1, 2, 3]), 0)).toThrow("temperature must be a positive finite number");
        expect(() => sampling.temperature(new Float32Array([1, 2, 3]), -1)).toThrow("temperature must be a positive finite number");
    });
});

describe("sampling.topK", () => {
    test("should keep only the top k values and set the rest to -Infinity", () => {
        const out = sampling.topK(new Float32Array([5, 1, 3, 2, 4]), 2);
        expect(out[0]).toBe(5);
        expect(out[1]).toBe(-Infinity);
        expect(out[2]).toBe(-Infinity);
        expect(out[3]).toBe(-Infinity);
        expect(out[4]).toBe(4);
    });

    test("should keep only the max for k=1", () => {
        const out = sampling.topK(new Float32Array([1, 2, 3]), 1);
        expect(Array.from(out)).toEqual([-Infinity, -Infinity, 3]);
    });

    test("should be a no-op when k equals the length", () => {
        const out = sampling.topK(new Float32Array([1, 2, 3]), 3);
        expect(Array.from(out)).toEqual([1, 2, 3]);
    });

    test("should not mutate the input", () => {
        const logits = new Float32Array([5, 1, 3]);
        const copy = new Float32Array(logits);
        sampling.topK(logits, 2);
        expect(logits).toEqual(copy);
    });

    test("should throw on invalid k", () => {
        expect(() => sampling.topK(new Float32Array([1, 2, 3]), 0)).toThrow("k must be an integer between 1 and logits.length");
        expect(() => sampling.topK(new Float32Array([1, 2, 3]), 4)).toThrow("k must be an integer between 1 and logits.length");
        expect(() => sampling.topK(new Float32Array([1, 2, 3]), 1.5)).toThrow("k must be an integer between 1 and logits.length");
    });
});

describe("sampling.topP", () => {
    test("should keep the smallest set whose cumulative probability reaches p", () => {
        const out = sampling.topP(new Float32Array([0.5, 0.3, 0.2]), 0.8);
        expect(out[0]).toBeCloseTo(0.625, 4);
        expect(out[1]).toBeCloseTo(0.375, 4);
        expect(out[2]).toBe(0);
    });

    test("should keep a single token for p equal to the top probability", () => {
        const out = sampling.topP(new Float32Array([0.5, 0.3, 0.2]), 0.5);
        expect(out[0]).toBeCloseTo(1, 4);
        expect(out[1]).toBe(0);
        expect(out[2]).toBe(0);
    });

    test("should keep everything for p = 1", () => {
        const out = sampling.topP(new Float32Array([0.5, 0.3, 0.2]), 1);
        expect(out[0]).toBeCloseTo(0.5, 4);
        expect(out[1]).toBeCloseTo(0.3, 4);
        expect(out[2]).toBeCloseTo(0.2, 4);
    });

    test("should not mutate the input", () => {
        const probs = new Float32Array([0.5, 0.3, 0.2]);
        const copy = new Float32Array(probs);
        sampling.topP(probs, 0.8);
        expect(probs).toEqual(copy);
    });

    test("should throw on invalid p", () => {
        expect(() => sampling.topP(new Float32Array([0.5, 0.5]), -0.1)).toThrow("p must be a number between 0 and 1");
        expect(() => sampling.topP(new Float32Array([0.5, 0.5]), 1.1)).toThrow("p must be a number between 0 and 1");
    });
});

describe("sampling.minP", () => {
    test("should keep tokens above p * max and renormalize", () => {
        const out = sampling.minP(new Float32Array([0.5, 0.3, 0.2]), 0.5);
        expect(out[0]).toBeCloseTo(0.625, 4);
        expect(out[1]).toBeCloseTo(0.375, 4);
        expect(out[2]).toBe(0);
    });

    test("should keep only the max for p = 1", () => {
        const out = sampling.minP(new Float32Array([0.5, 0.3, 0.2]), 1);
        expect(out[0]).toBeCloseTo(1, 4);
        expect(out[1]).toBe(0);
        expect(out[2]).toBe(0);
    });

    test("should keep everything for small p", () => {
        const out = sampling.minP(new Float32Array([0.5, 0.3, 0.2]), 0.1);
        expect(out[0]).toBeCloseTo(0.5, 4);
        expect(out[1]).toBeCloseTo(0.3, 4);
        expect(out[2]).toBeCloseTo(0.2, 4);
    });

    test("should throw on invalid p", () => {
        expect(() => sampling.minP(new Float32Array([0.5, 0.5]), -0.1)).toThrow("p must be a number between 0 and 1");
        expect(() => sampling.minP(new Float32Array([0.5, 0.5]), 1.1)).toThrow("p must be a number between 0 and 1");
    });
});

describe("sampling.repetitionPenalty", () => {
    test("should divide positive logits of seen tokens by the penalty", () => {
        const out = sampling.repetitionPenalty(new Float32Array([1, 2, 3]), 1.1, Uint32Array.of(0));
        expect(out[0]).toBeCloseTo(1 / 1.1, 4);
        expect(out[1]).toBe(2);
        expect(out[2]).toBe(3);
    });

    test("should multiply negative logits of seen tokens by the penalty", () => {
        const out = sampling.repetitionPenalty(new Float32Array([-1, 2, 3]), 1.1, Uint32Array.of(0));
        expect(out[0]).toBeCloseTo(-1.1, 4);
        expect(out[1]).toBe(2);
        expect(out[2]).toBe(3);
    });

    test("should be a no-op for penalty 1", () => {
        const out = sampling.repetitionPenalty(new Float32Array([1, 2, 3]), 1, Uint32Array.of(0, 1));
        expect(Array.from(out)).toEqual([1, 2, 3]);
    });

    test("should not mutate the input", () => {
        const logits = new Float32Array([1, 2, 3]);
        const copy = new Float32Array(logits);
        sampling.repetitionPenalty(logits, 1.1, Uint32Array.of(0));
        expect(logits).toEqual(copy);
    });

    test("should throw on out-of-range seen index", () => {
        expect(() => sampling.repetitionPenalty(new Float32Array([1, 2, 3]), 1.1, Uint32Array.of(5))).toThrow("seen contains an index out of range");
    });

    test("should throw on negative penalty", () => {
        expect(() => sampling.repetitionPenalty(new Float32Array([1, 2, 3]), -1, Uint32Array.of(0))).toThrow("penalty must be a non-negative finite number");
    });
});

describe("sampling.categorical", () => {
    test("should return a valid index for uniform probabilities", () => {
        const idx = sampling.categorical(new Float32Array([0.5, 0.5]), 42);
        expect(idx).toBeGreaterThanOrEqual(0);
        expect(idx).toBeLessThan(2);
    }, { repeats: 100 });

    test("should be deterministic for the same seed", () => {
        const probs = new Float32Array([0.5, 0.3, 0.2]);
        expect(sampling.categorical(probs, 7)).toBe(sampling.categorical(probs, 7));
    }, { repeats: 100 });

    test("should throw on empty input", () => {
        expect(() => sampling.categorical(new Float32Array([]), 1)).toThrow("Vector must not be empty");
    });
});

describe("sampling.greedy", () => {
    test("should return the index of the largest logit", () => {
        expect(sampling.greedy(new Float32Array([1, 5, 3]))).toBe(1);
        expect(sampling.greedy(new Float32Array([-2, -1]))).toBe(1);
    });

    test("should throw on empty input", () => {
        expect(() => sampling.greedy(new Float32Array([]))).toThrow("Vector must not be empty");
    });
});