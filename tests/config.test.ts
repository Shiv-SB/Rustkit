import { describe, test, expect } from "bun:test";
import { config } from "../src/index";
import { SIMD_NAMES } from "../src/packages/config";
import { nativeConfig } from "../src/native";
import pkg from "../package.json";
import rustCoreToml from "../crates/rustkit-core/Cargo.toml";
import rustFfiToml from "../crates/rustkit-ffi/Cargo.toml";

describe("config", () => {
    test("should expose a semver version", () => {
        expect(config.version).toBeString();
        expect(config.version).toMatch(/^\d+\.\d+\.\d+/);
    });

    test("should expose the resolved platform", () => {
        expect(config.platform).toBeString();
        expect(config.platform).not.toBeEmpty();
    });

    test("should expose the resolved binary path", () => {
        expect(config.binaryPath).toBeString();
        expect(config.binaryPath).not.toBeEmpty();
    });

    test("should expose a known SIMD backend", () => {
        expect(config.simd).toBeString();
        expect(SIMD_NAMES).toContain(config.simd);
    });
});

describe("SIMD backend index contract", () => {
    // The FFI side (`rk_config_simd` in crates/rustkit-ffi/src/config.rs) returns
    // an index into `SIMD_NAMES` (src/packages/config.ts). The contract:
    // 0 = scalar, 1 = neon, 2 = avx2, 3 = sse2. A mismatch between the two
    // sides silently mislabels the active backend.

    test("SIMD_NAMES order matches the FFI index contract", () => {
        expect(SIMD_NAMES[0]).toBe("scalar");
        expect(SIMD_NAMES[1]).toBe("neon");
        expect(SIMD_NAMES[2]).toBe("avx2");
        expect(SIMD_NAMES[3]).toBe("sse2");
        expect(SIMD_NAMES).toEqual(["scalar", "neon", "avx2", "sse2"]);
    });

    test("rk_config_simd mapping in the Rust source matches SIMD_NAMES", async () => {
        const ffiSource = await Bun.file(`${import.meta.dir}/../crates/rustkit-ffi/src/config.rs`).text();
        expect(ffiSource).toContain('"neon" => 1');
        expect(ffiSource).toContain('"avx2" => 2');
        expect(ffiSource).toContain('"sse2" => 3');
        expect(ffiSource).toContain("_ => 0");
    });

    test("config.simd is the SIMD_NAMES entry for the live FFI index", () => {
        const idx = nativeConfig.symbols.rk_config_simd();
        expect(idx).toBeInteger();
        expect(idx).toBeGreaterThanOrEqual(0);
        expect(idx).toBeLessThan(SIMD_NAMES.length);
        expect(config.simd).toBe(SIMD_NAMES[idx]!);
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