import { Effect, Optic, FileSystem } from 'effect';
import pkg from "../package.json";
import cargo_ffi from "../crates/rustkit-ffi/Cargo.toml";
import cargo_core from "../crates/rustkit-core/Cargo.toml";
import { BunRuntime } from "@effect/platform-bun"; 
import { layers } from './common';

type Pkg_T = typeof pkg;
type Cargo_T = {
    package: {
        version: string;
    }
}

const _cargoVersion = Optic.id<Cargo_T>()
    .key("package")
    .key("version");

const _pkgVersion = Optic.id<Pkg_T>()
    .key("version");

const Main = Effect.gen(function* () {
    const fs = yield* FileSystem.FileSystem;

    const pkg_ver = _pkgVersion.get(pkg);
    const cargo_ffi_ver = _cargoVersion.get(cargo_ffi);
    const cargo_core_ver = _cargoVersion.get(cargo_core);

    if (Bun.semver.order(pkg_ver, cargo_ffi_ver) !== 0) {
        yield* Effect.logWarning(`rustkit_ffi version ${cargo_ffi_ver} does not match package.json version ${pkg_ver}`);
        const updateVer = _cargoVersion.modify(() => pkg_ver);
        const newVer = updateVer(cargo_ffi);
        const newToml = Bun.TOML.stringify(newVer)!;
        yield* Effect.log(newVer);
        yield* Effect.log(newToml);
        yield* fs.writeFileString("crates/rustkit-ffi/Cargo.toml", newToml);
    }

    if (Bun.semver.order(pkg_ver, cargo_core_ver) !== 0) {
        yield* Effect.logWarning(`rustkit_core version ${cargo_core_ver} does not match package.json version ${pkg_ver}`);
        const updateVer = _cargoVersion.modify(() => pkg_ver);
        const newVer = updateVer(cargo_core);
        const newToml = Bun.TOML.stringify(newVer)!;
        yield* fs.writeFileString("crates/rustkit-core/Cargo.toml", newToml);
    }

    yield* Effect.log(`rustkit_core version ${cargo_core_ver} and rustkit_ffi version ${cargo_ffi_ver} match package.json version ${pkg_ver}`);
});

Main.pipe(
    Effect.provide(layers),
    BunRuntime.runMain(),
);