import { execSync } from "node:child_process";
import { mkdtempSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const root = join(import.meta.dir, "..");

const SMOKE_SCRIPT = `
import {
    vector, matrix, stats, bitset, string, geohash,
    crypto, quantile, distance, fft, entropy, quantize, config,
} from "rustkit";

const checks: Array<[string, boolean]> = [];

function check(name: string, fn: () => boolean) {
    try {
        const ok = fn();
        checks.push([name, ok]);
        if (!ok) console.error("FAIL:", name);
    } catch (e) {
        checks.push([name, false]);
        console.error("FAIL:", name, "-", (e as Error).message);
    }
}

check("config", () => {
    return (
        /^\\d+\\.\\d+\\.\\d+/.test(config.version) &&
        config.platform.length > 0 &&
        config.binaryPath.length > 0 &&
        ["scalar", "neon", "avx2", "sse2"].includes(config.simd)
    );
});

check("vector.add", () => {
    const r = vector.add(new Float32Array([1, 2]), new Float32Array([3, 4]));
    return r[0] === 4 && r[1] === 6;
});

check("matrix.mul", () => {
    const r = matrix.mul(new Float32Array([1, 2, 3, 4]), new Float32Array([5, 6, 7, 8]), 2, 2, 2);
    return r[0] === 19 && r[1] === 22 && r[2] === 43 && r[3] === 50;
});

check("stats.mean", () => {
    return stats.mean(new Float32Array([1, 2, 3, 4])) === 2.5;
});

check("bitset", () => {
    const b = bitset.create(64);
    bitset.set(b, 0);
    return bitset.popcount(b) === 1;
});

check("string.levenshtein", () => {
    return string.levenshtein("kitten", "sitting") === 3;
});

check("geohash", () => {
    const h = geohash.encode(48.8566, 2.3522, 5);
    const d = geohash.decode("u09tun");
    return h.length === 5 && Math.abs(d.lat - 48.86) < 0.1;
});

check("crypto.xxhash64", () => {
    return typeof crypto.xxhash64(new TextEncoder().encode("test")) === "bigint";
});

check("quantile.tdigest", () => {
    const d = quantile.createTDigest();
    if (d.numCentroids !== 0) return false;
    quantile.tDigestAdd(d, 42);
    if (d.numCentroids !== 1) return false;
    return Math.abs(quantile.tDigestQuantile(d, 0.5) - 42) < 0.001;
});

check("distance.euclidean", () => {
    return Math.abs(distance.euclidean(new Float32Array([0, 0]), new Float32Array([3, 4])) - 5) < 0.001;
});

check("fft.rfft", () => {
    return fft.rfft(new Float32Array([1, 2, 3, 4, 5, 6, 7, 8])).real.length === 5;
});

check("entropy.shannonEntropy", () => {
    return Math.abs(entropy.shannonEntropy(new Float32Array([0.5, 0.5])) - 1) < 0.001;
});

check("quantize.quantizeInt8", () => {
    const r = quantize.quantizeInt8(new Float32Array([0.5, -0.5]));
    return r.quantized.length === 2 && r.scale > 0;
});

// SIMD kernels process 8 f32 per iteration, so these use 64-element arrays
// to actually enter the vectorized loop (not just the scalar tail).
const ones64 = () => new Float32Array(64).fill(1);
const zeros64 = () => new Float32Array(64);
const ramp64 = () => Float32Array.from({ length: 64 }, (_, i) => i + 1);

check("simd.vector.dot", () => {
    return vector.dot(ones64(), ones64()) === 64;
});

check("simd.vector.sum", () => {
    return vector.sum(ones64()) === 64;
});

check("simd.vector.l1Norm", () => {
    const a = ones64();
    for (let i = 1; i < a.length; i += 2) a[i] = -1;
    return vector.l1Norm(a) === 64;
});

check("simd.vector.norm", () => {
    const a = zeros64();
    a[0] = 3;
    a[1] = 4;
    return Math.abs(vector.norm(a) - 5) < 0.001;
});

check("simd.vector.lInfNorm", () => {
    const a = ramp64();
    a[63] = -100;
    return vector.lInfNorm(a) === 100;
});

check("simd.distance.euclidean", () => {
    const a = zeros64();
    a[0] = 3;
    a[1] = 4;
    return Math.abs(distance.euclidean(a, zeros64()) - 5) < 0.001;
});

check("simd.distance.cosineSimilarity", () => {
    return Math.abs(distance.cosineSimilarity(ones64(), ones64()) - 1) < 0.001;
});

check("simd.matrix.frobeniusNorm", () => {
    return Math.abs(matrix.frobeniusNorm(ones64(), 8, 8) - 8) < 0.001;
});

check("simd.quantize.quantizeInt8", () => {
    const r = quantize.quantizeInt8(ramp64());
    return r.quantized.length === 64 && r.scale > 0;
});

const failed = checks.filter(([, ok]) => !ok);
if (failed.length > 0) {
    console.error(\`SMOKE FAIL: \${failed.length} module(s) failed\`);
    process.exit(1);
}
console.log("SMOKE OK");
`;

const tmp = mkdtempSync(join(tmpdir(), "rustkit-smoke-"));
try {
    console.log("PACK ...");
    // --quiet prints only the tarball path, so no globbing needed.
    const tgz = execSync(`bun pm pack --destination ${tmp} --quiet`, { cwd: root })
        .toString()
        .trim();
    console.log("TGZ:", tgz);

    console.log("INIT temp project ...");
    writeFileSync(join(tmp, "package.json"), JSON.stringify({ name: "smoke", version: "0.0.0", type: "module" }, null, 2));
    execSync(`bun add ${tgz}`, { cwd: tmp, stdio: "inherit" });

    console.log("RUN smoke ...");
    writeFileSync(join(tmp, "smoke.ts"), SMOKE_SCRIPT);
    execSync("bun smoke.ts", { cwd: tmp, stdio: "inherit" });
} finally {
    rmSync(tmp, { recursive: true, force: true });
}