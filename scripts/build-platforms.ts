import { execSync } from "node:child_process";
import { existsSync, mkdirSync, copyFileSync } from "node:fs";
import { join } from "node:path";
import { Effect, FileSystem, Option, Result, Stream } from "effect"

const root = join(import.meta.dir, "..");

interface PlatformTarget {
    ext: "dylib" | "so";
    rustupTarget: string;
    rustflags?: string;
    build: string[];
    artifact: string;
}

const TARGETS: Record<string, PlatformTarget> = {
    "darwin-arm64": {
        ext: "dylib",
        rustupTarget: "aarch64-apple-darwin",
        build: ["cargo", "zigbuild", "--release", "-p", "rustkit-ffi", "--target", "aarch64-apple-darwin"],
        artifact: join("target", "aarch64-apple-darwin", "release", "librustkit_ffi.dylib"),
    },
    "darwin-x64": {
        ext: "dylib",
        rustupTarget: "x86_64-apple-darwin",
        build: ["cargo", "zigbuild", "--release", "-p", "rustkit-ffi", "--target", "x86_64-apple-darwin"],
        artifact: join("target", "x86_64-apple-darwin", "release", "librustkit_ffi.dylib"),
    },
    "linux-x64-gnu": {
        ext: "so",
        rustupTarget: "x86_64-unknown-linux-gnu",
        build: ["cargo", "zigbuild", "--release", "-p", "rustkit-ffi", "--target", "x86_64-unknown-linux-gnu"],
        artifact: join("target", "x86_64-unknown-linux-gnu", "release", "librustkit_ffi.so"),
    },
    "linux-arm64-gnu": {
        ext: "so",
        rustupTarget: "aarch64-unknown-linux-gnu",
        build: ["cargo", "zigbuild", "--release", "-p", "rustkit-ffi", "--target", "aarch64-unknown-linux-gnu"],
        artifact: join("target", "aarch64-unknown-linux-gnu", "release", "librustkit_ffi.so"),
    },
    "linux-x64-musl": {
        ext: "so",
        rustupTarget: "x86_64-unknown-linux-musl",
        rustflags: "-C target-feature=-crt-static",
        build: ["cargo", "zigbuild", "--release", "-p", "rustkit-ffi", "--target", "x86_64-unknown-linux-musl"],
        artifact: join("target", "x86_64-unknown-linux-musl", "release", "librustkit_ffi.so"),
    },
    "linux-arm64-musl": {
        ext: "so",
        rustupTarget: "aarch64-unknown-linux-musl",
        rustflags: "-C target-feature=-crt-static",
        build: ["cargo", "zigbuild", "--release", "-p", "rustkit-ffi", "--target", "aarch64-unknown-linux-musl"],
        artifact: join("target", "aarch64-unknown-linux-musl", "release", "librustkit_ffi.so"),
    },
};

const hasCommand = (cmd: string) => Effect.try(() => execSync(`command -v ${cmd}`, { stdio: "ignore" })).pipe(
    Effect.result,
    Effect.andThen((result) => Result.match(result, {
        onSuccess: () => Effect.succeed(true),
        onFailure: () => Effect.succeed(false),
    }))
);

const Main = Effect.gen(function* () {
    const onlyArg: number = process.argv.indexOf("--only");
    const only: Option.Option<string> = onlyArg !== -1 
        ? Option.some(process.argv[onlyArg + 1]!) 
        : Option.none();

    if (process.platform !== "darwin" || process.arch !== "arm64") {
        return yield* Effect.die(new Error("build-platforms assumes a darwin-arm64 host; run per-platform builds manually elsewhere"));
    }

    const keys = Option.match(only, {
        onSome: (str) => [str],
        onNone: () => Object.keys(TARGETS)
    });

    let failed = false;
    
    yield* Effect.forEach(keys, Effect.fnUntraced(function* () {
        
    }));
});


for (const key of keys) {
    const target = TARGETS[key];
    if (!target) {
        console.error(`unknown platform key: ${key}`);
        failed = true;
        continue;
    }

    if (!hasCommand("cargo-zigbuild")) {
        console.error(`FAIL ${key}: cargo-zigbuild not installed. Install with: brew install cargo-zigbuild (or cargo install cargo-zigbuild)`);
        failed = true;
        continue;
    }

    console.log(`RUSTUP target add ${target.rustupTarget} ...`);
    execSync(`rustup target add ${target.rustupTarget}`, { cwd: root, stdio: "inherit" });

    console.log(`BUILD ${key} ...`);
    const env = target.rustflags ? { ...process.env, RUSTFLAGS: target.rustflags } : process.env;
    execSync(target.build.join(" "), { cwd: root, stdio: "inherit", env });

    const artifact = join(root, target.artifact);
    if (!existsSync(artifact)) {
        console.error(`FAIL ${key}: artifact missing at ${target.artifact}`);
        failed = true;
        continue;
    }

    const destDir = join(root, "platforms", key);
    mkdirSync(destDir, { recursive: true });
    copyFileSync(artifact, join(destDir, `librustkit_ffi.${target.ext}`));
    console.log(`OK   ${key} -> platforms/${key}/librustkit_ffi.${target.ext}`);
}

if (failed) {
    process.exit(1);
}