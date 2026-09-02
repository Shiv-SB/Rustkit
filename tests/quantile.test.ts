import { describe, test, expect } from "bun:test";
import { quantile } from "../src/index";

describe("quantile.TDigest", () => {
    test("should create TDigest with default max centroids", () => {
        const digest = quantile.createTDigest();
        expect(digest.means).toBeInstanceOf(Float32Array);
        expect(digest.counts).toBeInstanceOf(Float32Array);
        expect(digest.numCentroids).toBe(0);
        expect(digest.maxCentroids).toBe(100);
    });

    test("should create TDigest with custom max centroids", () => {
        const digest = quantile.createTDigest(50);
        expect(digest.maxCentroids).toBe(50);
        expect(digest.means.length).toBe(50);
        expect(digest.counts.length).toBe(50);
    });
});

describe("quantile.tDigestAdd", () => {
    test("should add values to digest", () => {
        const digest = quantile.createTDigest();
        quantile.tDigestAdd(digest, 1);
        expect(digest.numCentroids).toBe(1);
    });

    test("should add multiple values", () => {
        const digest = quantile.createTDigest();
        quantile.tDigestAdd(digest, 1);
        quantile.tDigestAdd(digest, 2);
        quantile.tDigestAdd(digest, 3);
        expect(digest.numCentroids).toBe(3);
    });
});

describe("quantile.tDigestQuantile", () => {
    test("should compute quantile from single value", () => {
        const digest = quantile.createTDigest();
        quantile.tDigestAdd(digest, 42);
        expect(quantile.tDigestQuantile(digest, 0.5)).toBeCloseTo(42, 4);
    });

    test("should compute quantile from multiple values", () => {
        const digest = quantile.createTDigest();
        quantile.tDigestAdd(digest, 1);
        quantile.tDigestAdd(digest, 2);
        quantile.tDigestAdd(digest, 3);
        const q = quantile.tDigestQuantile(digest, 0.5);
        expect(q).toBeGreaterThanOrEqual(1);
        expect(q).toBeLessThanOrEqual(3);
    });
});

describe("quantile.CountMinSketch", () => {
    test("should create sketch with correct dimensions", () => {
        const sketch = quantile.createCountMinSketch(3, 10);
        expect(sketch).toBeInstanceOf(Uint32Array);
        expect(sketch.length).toBe(30);
    });

    test("should add items to sketch", () => {
        const sketch = quantile.createCountMinSketch(3, 10);
        const item = new TextEncoder().encode("hello");
        quantile.countMinSketchAdd(sketch, 3, 10, item);
        const total = sketch.reduce((s, v) => s + v, 0);
        expect(total).toBeGreaterThan(0);
    });

    test("should increment count for repeated items", () => {
        const sketch = quantile.createCountMinSketch(3, 10);
        const item = new TextEncoder().encode("test");
        quantile.countMinSketchAdd(sketch, 3, 10, item);
        const count1 = sketch[0]!;
        quantile.countMinSketchAdd(sketch, 3, 10, item);
        expect(sketch[0]).toBeGreaterThanOrEqual(count1);
    });

    test("should throw on invalid depth in add", () => {
        const sketch = quantile.createCountMinSketch(3, 10);
        expect(() => quantile.countMinSketchAdd(sketch, 0, 10, new Uint8Array([1]))).toThrow("Depth must be greater than 0");
    });

    test("should throw on invalid width in add", () => {
        const sketch = quantile.createCountMinSketch(3, 10);
        expect(() => quantile.countMinSketchAdd(sketch, 3, 0, new Uint8Array([1]))).toThrow("Width must be greater than 0");
    });

    test("should throw on table length mismatch in add", () => {
        expect(() => quantile.countMinSketchAdd(new Uint32Array(3), 3, 10, new Uint8Array([1]))).toThrow("table must have length depth * width");
    });

    test("should throw on table length mismatch in query", () => {
        expect(() => quantile.countMinSketchQuery(new Uint32Array(3), 3, 10, new Uint8Array([1]))).toThrow("table must have length depth * width");
    });
});

describe("quantile.BloomFilter", () => {
    test("should create bloom filter", () => {
        const filter = quantile.createBloomFilter(128);
        expect(filter).toBeInstanceOf(BigUint64Array);
        expect(filter.length).toBe(2);
    });

    test("should create filter with exact word count", () => {
        const filter = quantile.createBloomFilter(64);
        expect(filter.length).toBe(1);
    });

    test("should insert items into filter", () => {
        const filter = quantile.createBloomFilter(128);
        const item = new TextEncoder().encode("hello");
        quantile.bloomFilterInsert(filter, 128, item, 3);
        const count = Array.from(filter).reduce((s, v) => s + Number(v).toString(2).split("1").length - 1, 0);
        expect(count).toBeGreaterThan(0);
    });

    test("should handle multiple inserts", () => {
        const filter = quantile.createBloomFilter(256);
        const item1 = new TextEncoder().encode("hello");
        const item2 = new TextEncoder().encode("world");
        quantile.bloomFilterInsert(filter, 256, item1, 3);
        quantile.bloomFilterInsert(filter, 256, item2, 3);
        const count = Array.from(filter).reduce((s, v) => s + Number(v).toString(2).split("1").length - 1, 0);
        expect(count).toBeGreaterThan(0);
    });

    test("should throw on invalid numBits in insert", () => {
        expect(() => quantile.bloomFilterInsert(new BigUint64Array(1), 0, new Uint8Array([1]), 3)).toThrow("numBits must be greater than 0");
    });

    test("should throw on invalid numHashes in insert", () => {
        expect(() => quantile.bloomFilterInsert(new BigUint64Array(1), 128, new Uint8Array([1]), 0)).toThrow("numHashes must be greater than 0");
    });

    test("should throw on bits length mismatch in insert", () => {
        expect(() => quantile.bloomFilterInsert(new BigUint64Array(3), 200, new Uint8Array([1]), 3)).toThrow("bits must have length ceil(numBits / 64)");
    });

    test("should throw on bits length mismatch in contains", () => {
        expect(() => quantile.bloomFilterContains(new BigUint64Array(3), 200, new Uint8Array([1]), 3)).toThrow("bits must have length ceil(numBits / 64)");
    });
});

describe("quantile.countMinSketchQuery", () => {
    test("should return count for inserted item", () => {
        const sketch = quantile.createCountMinSketch(3, 10);
        const item = new TextEncoder().encode("hello");
        quantile.countMinSketchAdd(sketch, 3, 10, item);
        const count = quantile.countMinSketchQuery(sketch, 3, 10, item);
        expect(count).toBeGreaterThanOrEqual(1);
    });

    test("should return 0 for never-inserted item", () => {
        const sketch = quantile.createCountMinSketch(3, 10);
        const item = new TextEncoder().encode("missing");
        const count = quantile.countMinSketchQuery(sketch, 3, 10, item);
        expect(count).toBe(0);
    });

    test("should throw on invalid depth", () => {
        const sketch = quantile.createCountMinSketch(3, 10);
        expect(() => quantile.countMinSketchQuery(sketch, 0, 10, new Uint8Array([]))).toThrow("Depth must be greater than 0");
    });

    test("should throw on invalid width", () => {
        const sketch = quantile.createCountMinSketch(3, 10);
        expect(() => quantile.countMinSketchQuery(sketch, 3, 0, new Uint8Array([]))).toThrow("Width must be greater than 0");
    });
});

describe("quantile.bloomFilterContains", () => {
    test("should return true for inserted item", () => {
        const filter = quantile.createBloomFilter(128);
        const item = new TextEncoder().encode("hello");
        quantile.bloomFilterInsert(filter, 128, item, 3);
        expect(quantile.bloomFilterContains(filter, 128, item, 3)).toBe(true);
    });

    test("should likely return false for non-inserted item", () => {
        const filter = quantile.createBloomFilter(1024);
        const inserted = new TextEncoder().encode("hello");
        const query = new TextEncoder().encode("world");
        quantile.bloomFilterInsert(filter, 1024, inserted, 3);
        // With a large filter and few inserts, false positive rate is very low
        expect(quantile.bloomFilterContains(filter, 1024, query, 3)).toBe(false);
    });

    test("should throw on invalid numBits", () => {
        expect(() => quantile.bloomFilterContains(new BigUint64Array(1), 0, new Uint8Array([1]), 3)).toThrow("numBits must be greater than 0");
    });

    test("should throw on invalid numHashes", () => {
        expect(() => quantile.bloomFilterContains(new BigUint64Array(1), 128, new Uint8Array([1]), 0)).toThrow("numHashes must be greater than 0");
    });
});

describe("quantile.HyperLogLog", () => {
    test("should create sketch with correct size", () => {
        const sketch = quantile.hyperloglogCreate(10);
        expect(sketch).toBeInstanceOf(Uint8Array);
        expect(sketch.length).toBe(1024); // 2^10
    });

    test("should estimate cardinality after inserts", () => {
        const sketch = quantile.hyperloglogCreate(10);
        for (let i = 0; i < 100; i++) {
            quantile.hyperloglogAdd(sketch, new TextEncoder().encode(`item-${i}`));
        }
        const estimate = quantile.hyperloglogEstimate(sketch);
        expect(estimate).toBeGreaterThan(50);
        expect(estimate).toBeLessThan(200);
    });

    test("should throw on invalid precision", () => {
        expect(() => quantile.hyperloglogCreate(3)).toThrow("Precision must be between 4 and 16");
        expect(() => quantile.hyperloglogCreate(17)).toThrow("Precision must be between 4 and 16");
    });

    test("should throw on empty sketch", () => {
        expect(() => quantile.hyperloglogAdd(new Uint8Array([]), new Uint8Array([1]))).toThrow("Sketch must not be empty");
        expect(() => quantile.hyperloglogEstimate(new Uint8Array([]))).toThrow("Sketch must not be empty");
    });

    test("should throw on non-power-of-two sketch length", () => {
        expect(() => quantile.hyperloglogAdd(new Uint8Array(3), new Uint8Array([1]))).toThrow("Sketch length must be a power of two");
    });
});

describe("quantile.MinHash", () => {
    test("should create signature with correct length", () => {
        const sig = quantile.minhashCreate(128);
        expect(sig).toBeInstanceOf(Uint32Array);
        expect(sig.length).toBe(128);
    });

    test("should compute similarity of identical sets", () => {
        const sigA = quantile.minhashCreate(128);
        const sigB = quantile.minhashCreate(128);
        const items = ["hello", "world", "test"];
        for (const item of items) {
            const bytes = new TextEncoder().encode(item);
            quantile.minhashAdd(sigA, bytes);
            quantile.minhashAdd(sigB, bytes);
        }
        expect(quantile.minhashSimilarity(sigA, sigB)).toBeCloseTo(1, 4);
    });

    test("should compute low similarity for disjoint sets", () => {
        const sigA = quantile.minhashCreate(128);
        const sigB = quantile.minhashCreate(128);
        for (let i = 0; i < 50; i++) {
            quantile.minhashAdd(sigA, new TextEncoder().encode(`a-${i}`));
            quantile.minhashAdd(sigB, new TextEncoder().encode(`b-${i}`));
        }
        const sim = quantile.minhashSimilarity(sigA, sigB);
        expect(sim).toBeGreaterThanOrEqual(0);
        expect(sim).toBeLessThan(0.5);
    });

    test("should throw on invalid numHashes", () => {
        expect(() => quantile.minhashCreate(0)).toThrow("numHashes must be greater than 0");
    });

    test("should throw on empty signature", () => {
        expect(() => quantile.minhashAdd(new Uint32Array([]), new Uint8Array([1]))).toThrow("Signature must not be empty");
    });

    test("should throw on mismatched lengths", () => {
        expect(() => quantile.minhashSimilarity(new Uint32Array(10), new Uint32Array(20))).toThrow("Signatures must have the same length");
    });
});
