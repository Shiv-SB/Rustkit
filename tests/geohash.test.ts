import { describe, test, expect } from "bun:test";
import { geohash } from "../src/index";

describe("geohash.encode", () => {
    test("should encode a coordinate", () => {
        const hash = geohash.encode(48.8566, 2.3522, 5);
        expect(hash).toBeString();
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
        expect(hash).toBeString();
        expect(hash.length).toBe(5);
    });

    test("should produce consistent results", () => {
        const hash1 = geohash.encode(48.8566, 2.3522, 6);
        const hash2 = geohash.encode(48.8566, 2.3522, 6);
        expect(hash1).toBe(hash2);
    });

    test("should throw on precision 0", () => {
        expect(() => geohash.encode(48.8566, 2.3522, 0)).toThrowError("Precision must be an integer between 1 and 12");
    });

    test("should throw on precision above 12", () => {
        expect(() => geohash.encode(48.8566, 2.3522, 13)).toThrowError("Precision must be an integer between 1 and 12");
    });

    test("should throw on non-integer precision", () => {
        expect(() => geohash.encode(48.8566, 2.3522, 5.5)).toThrowError("Precision must be an integer between 1 and 12");
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
        expect(result.lat).toBeNumber();
        expect(result.lng).toBeNumber();
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
        expect(north).toBeString();
        expect(north.length).toBe(hash.length);
        expect(north).not.toBe(hash);
    });

    test("should find south neighbor", () => {
        const hash = geohash.encode(48.8566, 2.3522, 6);
        const south = geohash.neighbor(hash, 1);
        expect(south).toBeString();
        expect(south.length).toBe(hash.length);
        expect(south).not.toBe(hash);
    });

    test("should find east neighbor", () => {
        const hash = geohash.encode(48.8566, 2.3522, 6);
        const east = geohash.neighbor(hash, 2);
        expect(east).toBeString();
        expect(east.length).toBe(hash.length);
        expect(east).not.toBe(hash);
    });

    test("should find west neighbor", () => {
        const hash = geohash.encode(48.8566, 2.3522, 6);
        const west = geohash.neighbor(hash, 3);
        expect(west).toBeString();
        expect(west.length).toBe(hash.length);
        expect(west).not.toBe(hash);
    });

    test("should throw on direction below 0", () => {
        const hash = geohash.encode(48.8566, 2.3522, 6);
        expect(() => geohash.neighbor(hash, -1)).toThrowError("Direction must be an integer between 0 and 7");
    });

    test("should throw on direction above 7", () => {
        const hash = geohash.encode(48.8566, 2.3522, 6);
        expect(() => geohash.neighbor(hash, 8)).toThrowError("Direction must be an integer between 0 and 7");
    });

    test("should throw on non-integer direction", () => {
        const hash = geohash.encode(48.8566, 2.3522, 6);
        expect(() => geohash.neighbor(hash, 1.5)).toThrowError("Direction must be an integer between 0 and 7");
    });
});

describe("geohash.distance", () => {
    test("should return 0 for same point", () => {
        expect(geohash.distance(48.8566, 2.3522, 48.8566, 2.3522)).toBe(0);
    });

    test("should compute distance between two points", () => {
        const dist = geohash.distance(48.8566, 2.3522, 52.5200, 13.4050);
        expect(dist).toBeGreaterThan(0);
    });

    test("should be symmetric", () => {
        const d1 = geohash.distance(48.8566, 2.3522, 52.5200, 13.4050);
        const d2 = geohash.distance(52.5200, 13.4050, 48.8566, 2.3522);
        expect(d1).toBe(d2);
    });

    test("should return approximate km for known distance", () => {
        const dist = geohash.distance(48.8566, 2.3522, 52.5200, 13.4050);
        expect(dist).toBeGreaterThan(800);
        expect(dist).toBeLessThan(1200);
    });
});

describe("geohash.isValid", () => {
    test("should return true for valid geohash", () => {
        expect(geohash.isValid("u09tun")).toBeTrue();
    });

    test("should return true for single character", () => {
        expect(geohash.isValid("s")).toBeTrue();
    });

    test("should return false for invalid characters", () => {
        expect(geohash.isValid("abc!@#")).toBeFalse();
    });

    test("should return false for empty string", () => {
        expect(geohash.isValid("")).toBeFalse();
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
        expect(result.maxLat).toBeNumber();
        expect(result.maxLng).toBeNumber();
        expect(result.minLat).toBeNumber();
        expect(result.minLng).toBeNumber();
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
