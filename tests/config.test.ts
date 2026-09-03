import { describe, test, expect } from "bun:test";
import { config } from "../src/index";
import pkg from "../package.json";
import rustCoreToml from "../crates/rustkit-core/Cargo.toml";
import rustFfiToml from "../crates/rustkit-ffi/Cargo.toml";

describe("config", () => {
    test("should expose a semver version", () => {
        expect(typeof config.version).toBe("string");
        expect(config.version).toMatch(/^\d+\.\d+\.\d+/);
    });

    test("should expose the resolved platform", () => {
        expect(typeof config.platform).toBe("string");
        expect(config.platform.length).toBeGreaterThan(0);
    });

    test("should expose the resolved binary path", () => {
        expect(typeof config.binaryPath).toBe("string");
        expect(config.binaryPath.length).toBeGreaterThan(0);
    });

    test("should expose a known SIMD backend", () => {
        expect(["scalar", "neon", "avx2", "sse2"]).toContain(config.simd);
    });
});

describe("semver match", () => {
    interface TomlConfig {
        package: {
            version: string;
        }
    }

    const pkgVer = pkg.version; // source of truth
    const exposedVer = config.version;
    const rustCoreVer = (rustCoreToml as TomlConfig).package.version;
    const rustFfiVer = (rustFfiToml as TomlConfig).package.version;

    test("config version should match", () => {
        expect(exposedVer).toBe(pkgVer);
    });

    test("rustkit-core version should match", () => {
        expect(rustCoreVer).toBe(pkgVer);
    });

    test("rustkit-ffi version should match", () => {
        expect(rustFfiVer).toBe(pkgVer);
    });
});