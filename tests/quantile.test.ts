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
        const count1 = sketch[0];
        quantile.countMinSketchAdd(sketch, 3, 10, item);
        expect(sketch[0]).toBeGreaterThanOrEqual(count1);
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
});
