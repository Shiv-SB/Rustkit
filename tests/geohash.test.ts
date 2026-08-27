import { describe, test, expect } from "bun:test";
import { geohash } from "../src/index";

describe("geohash.encode", () => {
    test("should encode a coordinate", () => {
        const hash = geohash.encode(48.8566, 2.3522, 5);
        expect(typeof hash).toBe("string");
        expect(hash.length).toBe(5);
    });

    test("should encode with different precisions", () => {
        const hash3 = geohash.encode(48.8566, 2.3522, 3);
        const hash8 = geohash.encode(48.8566, 2.3522, 8);
        expect(hash3.length).toBe(3);
        expect(hash8.length).toBe(8);
    });

    test("should encode known location", () => {
        const hash = geohash.encode(0, 0, 5);
        expect(typeof hash).toBe("string");
        expect(hash.length).toBe(5);
    });

    test("should produce consistent results", () => {
        const hash1 = geohash.encode(48.8566, 2.3522, 6);
        const hash2 = geohash.encode(48.8566, 2.3522, 6);
        expect(hash1).toBe(hash2);
    });
});

describe("geohash.decode", () => {
    test("should decode to coordinates", () => {
        const result = geohash.decode("u09tun");
        expect(result.lat).toBeCloseTo(53.35, 0);
        expect(result.lng).toBeCloseTo(-6.26, 0);
    });

    test("should decode single character hash", () => {
        const result = geohash.decode("s");
        expect(typeof result.lat).toBe("number");
        expect(typeof result.lng).toBe("number");
    });

    test("should round-trip encode/decode", () => {
        const lat = 48.8566;
        const lng = 2.3522;
        const hash = geohash.encode(lat, lng, 8);
        const decoded = geohash.decode(hash);
        expect(decoded.lat).toBeCloseTo(lat, 2);
        expect(decoded.lng).toBeCloseTo(lng, 2);
    });
});

describe("geohash.neighbor", () => {
    test("should find north neighbor", () => {
        const hash = geohash.encode(48.8566, 2.3522, 6);
        const north = geohash.neighbor(hash, 0);
        expect(typeof north).toBe("string");
        expect(north.length).toBe(hash.length);
        expect(north).not.toBe(hash);
    });

    test("should find south neighbor", () => {
        const hash = geohash.encode(48.8566, 2.3522, 6);
        const south = geohash.neighbor(hash, 1);
        expect(typeof south).toBe("string");
        expect(south.length).toBe(hash.length);
        expect(south).not.toBe(hash);
    });

    test("should find east neighbor", () => {
        const hash = geohash.encode(48.8566, 2.3522, 6);
        const east = geohash.neighbor(hash, 2);
        expect(typeof east).toBe("string");
        expect(east.length).toBe(hash.length);
        expect(east).not.toBe(hash);
    });

    test("should find west neighbor", () => {
        const hash = geohash.encode(48.8566, 2.3522, 6);
        const west = geohash.neighbor(hash, 3);
        expect(typeof west).toBe("string");
        expect(west.length).toBe(hash.length);
        expect(west).not.toBe(hash);
    });
});

describe("geohash.distance", () => {
    test("should return 0 for same point", () => {
        expect(geohash.distance(48.8566, 2.3522, 48.8566, 2.3522)).toBeCloseTo(0, 4);
    });

    test("should compute distance between two points", () => {
        const dist = geohash.distance(48.8566, 2.3522, 52.5200, 13.4050);
        expect(dist).toBeGreaterThan(0);
    });

    test("should be symmetric", () => {
        const d1 = geohash.distance(48.8566, 2.3522, 52.5200, 13.4050);
        const d2 = geohash.distance(52.5200, 13.4050, 48.8566, 2.3522);
        expect(d1).toBeCloseTo(d2, 4);
    });

    test("should return approximate km for known distance", () => {
        const dist = geohash.distance(48.8566, 2.3522, 52.5200, 13.4050);
        expect(dist).toBeGreaterThan(800);
        expect(dist).toBeLessThan(1200);
    });
});
