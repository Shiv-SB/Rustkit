import { Effect, FileSystem, Option, Path, flow } from "effect";
import { ChildProcess } from "effect/unstable/process";
import { layers } from "./common";
import { BunRuntime } from "@effect/platform-bun";

//#region Types

type Ext = "dylib" | "so";

type RustupTarget =
    | "aarch64-apple-darwin"
    | "x86_64-apple-darwin"
    | "x86_64-unknown-linux-gnu"
    | "aarch64-unknown-linux-gnu"
    | "x86_64-unknown-linux-musl"
    | "aarch64-unknown-linux-musl";

type Build<Target extends RustupTarget> = [
    "cargo",
    "zigbuild",
    "--release",
    "-p",
    "rustkit-ffi",
    "--target",
    Target,
];

type Artifact<Target extends RustupTarget, E extends Ext> = [
    "target",
    Target,
    "release",
    `librustkit_ffi.${E}`,
];

interface PlatformTarget<E extends Ext, R extends RustupTarget> {
    ext: E;
    rustupTarget: R;
    rustFlags?: string;
    build: Build<R>;
    artifact: Artifact<R, E>;
}

type TargetMap = {
    "darwin-arm64": PlatformTarget<"dylib", "aarch64-apple-darwin">;
    "darwin-x64": PlatformTarget<"dylib", "x86_64-apple-darwin">;
    "linux-x64-gnu": PlatformTarget<"so", "x86_64-unknown-linux-gnu">;
    "linux-arm64-gnu": PlatformTarget<"so", "aarch64-unknown-linux-gnu">;
    "linux-x64-musl": PlatformTarget<"so", "x86_64-unknown-linux-musl">;
    "linux-arm64-musl": PlatformTarget<"so", "aarch64-unknown-linux-musl">;
};

type Target = keyof TargetMap;

//#region Targets

const makePlatformTarget = <E extends Ext, R extends RustupTarget>(
    ext: E,
    rustupTarget: R,
    rustFlags?: string,
): PlatformTarget<E, R> => ({
    ext,
    rustupTarget,
    rustFlags,

    build: [
        "cargo",
        "zigbuild",
        "--release",
        "-p",
        "rustkit-ffi",
        "--target",
        rustupTarget,
    ],

    artifact: ["target", rustupTarget, "release", `librustkit_ffi.${ext}`],
});

const TARGETS: TargetMap = {
    "darwin-arm64": makePlatformTarget("dylib", "aarch64-apple-darwin"),
    "darwin-x64": makePlatformTarget("dylib", "x86_64-apple-darwin"),
    "linux-x64-gnu": makePlatformTarget("so", "x86_64-unknown-linux-gnu"),
    "linux-arm64-gnu": makePlatformTarget("so", "aarch64-unknown-linux-gnu"),
    "linux-x64-musl": makePlatformTarget(
        "so",
        "x86_64-unknown-linux-musl",
        "-C target-feature=-crt-static",
    ),
    "linux-arm64-musl": makePlatformTarget(
        "so",
        "aarch64-unknown-linux-musl",
        "-C target-feature=-crt-static",
    ),
};

//#region Utils

const getRoot = Effect.service(Path.Path).pipe(
    Effect.map((path) => path.join(import.meta.dir, ".."))
);

const hasCommand = Effect.fnUntraced(function* (cmd: string) {
    const pipeline = yield* ChildProcess.make(`command -v ${cmd}`, {
        stdout: "ignore",
        stderr: "ignore",
    });
    const result = yield* pipeline.exitCode;

    // 0 -> !0 -> true
    // 1 -> !1 -> false
    // 127 -> !127 -> false
    return !result;
}, flow(Effect.scoped));

const Main = Effect.gen(function* () {
    if (!(yield* hasCommand("cargo-zigbuild"))) {
        return yield* Effect.die(
            new Error(
                `cargo-zigbuild not installed. Install with: 'cargo install cargo-zigbuild'`,
            ),
        );
    }

    const onlyArg: number = process.argv.indexOf("--only");
    const only: Option.Option<string> =
        onlyArg !== -1 ? Option.some(process.argv[onlyArg + 1]!) : Option.none();

    if (process.platform !== "darwin" || process.arch !== "arm64") {
        return yield* Effect.die(
            new Error(
                "build-platforms assumes a darwin-arm64 host; run per-platform builds manually elsewhere",
            ),
        );
    }

    const keys = Option.match(only, {
        onSome: (str) => [str],
        onNone: () => Object.keys(TARGETS),
    }) as Target[];

    const path = yield* Path.Path;
    const fs = yield* FileSystem.FileSystem;
    const root = yield* getRoot;

    const results = yield* Effect.forEach(
        keys,
        Effect.fnUntraced(function* (key) {
            const target = TARGETS[key];

            yield* Effect.log(`RUSTUP target add ${target.rustupTarget} ...`);
            yield* ChildProcess.make(`rustup target add ${target.rustupTarget}`, {
                cwd: root,
                stderr: "inherit",
                stdout: "inherit",
            }).pipe(
                Effect.andThen((proc) => proc.exitCode),
                Effect.scoped,
            );

            yield* Effect.log(`BUILD ${key}`);
            const env = target.rustFlags
                ? { ...process.env, RUSTFLAGS: target.rustFlags }
                : process.env;

            yield* ChildProcess.make(target.build.join(""), {
                cwd: root,
                env,
                stdout: "inherit",
                stderr: "inherit",
            }).pipe(
                Effect.andThen((proc) => proc.exitCode),
                Effect.scoped,
            );

            const artifact = path.join(root, ...target.artifact);
            if (!(yield* fs.exists(artifact))) {
                yield* Effect.logError(`${key} artifict missing at ${target.artifact}`);
                return Option.some(new Error(`${key} artifict missing at ${target.artifact}`));
            }

            const destDir = path.join(root, "platforms", key);
            yield* fs.makeDirectory(destDir, { recursive: true });
            yield* fs.copyFile(artifact, path.join(destDir, `librustkit_ffi.${target.ext}`));
            yield* Effect.log(`OK   ${key} -> platforms/${key}/librustkit_ffi.${target.ext}`);
            return Option.none();
        }),
        { discard: false }
    );

    if (results.some((opt) => Option.isSome(opt))) {
        yield* Effect.logFatal("Build completed with errors");

        for (const result of results) {
            if (Option.isNone(result)) continue;

            const err = result.value;

            yield* Effect.logError(err);
        }

        process.exitCode = 1;
    }
});

Main.pipe(
    Effect.provide(layers),
    BunRuntime.runMain,
)

