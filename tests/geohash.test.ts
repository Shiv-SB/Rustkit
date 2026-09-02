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
        expect(result.lat).toBeCloseTo(48.86, 0);
        expect(result.lng).toBeCloseTo(2.29, 0);
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

describe("geohash.isValid", () => {
    test("should return true for valid geohash", () => {
        expect(geohash.isValid("u09tun")).toBe(true);
    });

    test("should return true for single character", () => {
        expect(geohash.isValid("s")).toBe(true);
    });

    test("should return false for invalid characters", () => {
        expect(geohash.isValid("abc!@#")).toBe(false);
    });

    test("should return false for empty string", () => {
        expect(geohash.isValid("")).toBe(false);
    });
});

describe("geohash.allNeighbors", () => {
    test("should return 8 neighbors", () => {
        const hash = geohash.encode(48.8566, 2.3522, 6);
        const neighbors = geohash.allNeighbors(hash);
        expect(neighbors.length).toBe(8);
    });

    test("should return strings of same length", () => {
        const hash = geohash.encode(48.8566, 2.3522, 5);
        const neighbors = geohash.allNeighbors(hash);
        for (const n of neighbors) {
            expect(n.length).toBe(5);
        }
    });

    test("should not include the original hash", () => {
        const hash = geohash.encode(48.8566, 2.3522, 6);
        const neighbors = geohash.allNeighbors(hash);
        expect(neighbors).not.toContain(hash);
    });
});

describe("geohash.bbox", () => {
    test("should return bounding box", () => {
        const result = geohash.bbox("u09tun");
        expect(typeof result.minLat).toBe("number");
        expect(typeof result.minLng).toBe("number");
        expect(typeof result.maxLat).toBe("number");
        expect(typeof result.maxLng).toBe("number");
    });

    test("should have min <= max", () => {
        const result = geohash.bbox("u09tun");
        expect(result.minLat).toBeLessThanOrEqual(result.maxLat);
        expect(result.minLng).toBeLessThanOrEqual(result.maxLng);
    });

    test("should contain the decoded center point", () => {
        const hash = "u09tun";
        const { lat, lng } = geohash.decode(hash);
        const box = geohash.bbox(hash);
        expect(lat).toBeGreaterThanOrEqual(box.minLat);
        expect(lat).toBeLessThanOrEqual(box.maxLat);
        expect(lng).toBeGreaterThanOrEqual(box.minLng);
        expect(lng).toBeLessThanOrEqual(box.maxLng);
    });
});
