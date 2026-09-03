import { nativeConfig, ptr, resolvedPlatform, resolvedBinaryPath } from "../native";

const SIMD_NAMES = ["scalar", "neon", "avx2", "sse2"] as const;
export type SimdBackend = (typeof SIMD_NAMES)[number];

export interface RustkitConfig {
    /** The version of the Rustkit library, sourced from the native binary. */
    readonly version: string;
    /** The resolved platform identifier (e.g., "darwin-arm64", "linux-x64-gnu"). */
    readonly platform: string;
    /** The absolute path to the loaded native binary. */
    readonly binaryPath: string;
    /** The active SIMD backend for hot kernels (e.g., "neon", "avx2", "sse2", or "scalar"). */
    readonly simd: SimdBackend;
}

const version: string = (() => {
    const buf = new Uint8Array(32);
    nativeConfig.symbols.rk_config_version(ptr(buf), buf.length);
    const decoded = new TextDecoder().decode(buf);
    const nul = decoded.indexOf("\0");
    return (nul === -1 ? decoded : decoded.slice(0, nul)).trim();
})()

/**
 * Read-only runtime configuration for the Rustkit library.
 *
 * Populated once at module load from the native binary. All fields are
 * static for the lifetime of the process.
 */
export const config: RustkitConfig = {
    version,
    platform: resolvedPlatform,
    binaryPath: resolvedBinaryPath,
    simd: SIMD_NAMES[nativeConfig.symbols.rk_config_simd()] ?? "scalar",
};