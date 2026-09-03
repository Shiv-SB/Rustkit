# Security Policy

## Reporting a vulnerability

Please report security vulnerabilities through GitHub's Private Vulnerability Reporting:

**[Report a vulnerability](https://github.com/Shiv-SB/Rustkit/security/advisories/new)**

Do **not** open a public issue for security problems.

Include, if possible:

- Affected version(s)
- Steps to reproduce (a failing test case is ideal)
- Impact / what an attacker could gain

You will receive an acknowledgment within 48 hours and updates as the issue is triaged and fixed. Once a fix is published, the advisory is disclosed following the [GitHub Security Advisory](https://docs.github.com/en/code-security/security-advisories) process.

## Supported versions

Only the latest published npm version receives security fixes. This is a `0.x` package — API changes may land in minor releases.

## Scope

- **In scope**: the Rust crates (`crates/`), the FFI layer, the TypeScript wrappers (`src/`), and the packaged native binaries.
- **Out of scope**: memory-safety issues in the non-`unsafe` Rust code paths (Rust's guarantees apply), and theoretical side channels in the non-cryptographic hash functions (`crypto` module) — they are explicitly not for security use.