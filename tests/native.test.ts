import { describe, test, expect } from "bun:test";
import { platformCandidates } from "../src/native";

describe("platformCandidates", () => {
    test("should prefer gnu on glibc linux", () => {
        expect(platformCandidates("linux", "x64", false)).toEqual([
            "linux-x64-gnu",
            "linux-x64-musl",
        ]);
    });

    test("should prefer musl on musl linux", () => {
        expect(platformCandidates("linux", "x64", true)).toEqual([
            "linux-x64-musl",
            "linux-x64-gnu",
        ]);
    });

    test("should handle arm64 linux", () => {
        expect(platformCandidates("linux", "arm64", true)).toEqual([
            "linux-arm64-musl",
            "linux-arm64-gnu",
        ]);
    });

    test("should return single candidate for non-linux", () => {
        expect(platformCandidates("darwin", "arm64", false)).toEqual(["darwin-arm64"]);
        expect(platformCandidates("win32", "x64", false)).toEqual(["win32-x64"]);
    });
});