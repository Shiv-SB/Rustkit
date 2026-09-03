import { nativeSampling, ptr } from "../native";

/**
 * Applies the numerically stable softmax to logits.
 *
 * @param logits - Raw logits (not mutated).
 * @returns A new Float32Array of probabilities summing to 1.
 * @throws {Error} If `logits` is empty.
 */
export function softmax(
    logits: Float32Array
): Float32Array {
    if (logits.length === 0) {
        throw new Error("Vector must not be empty");
    }

    const out = new Float32Array(logits);

    nativeSampling.symbols.rk_sampling_softmax_f32(
        ptr(out),
        out.length
    );

    return out;
}

/**
 * Applies the numerically stable log-softmax to logits.
 *
 * @param logits - Raw logits (not mutated).
 * @returns A new Float32Array of log-probabilities.
 * @throws {Error} If `logits` is empty.
 */
export function logSoftmax(
    logits: Float32Array
): Float32Array {
    if (logits.length === 0) {
        throw new Error("Vector must not be empty");
    }

    const out = new Float32Array(logits);

    nativeSampling.symbols.rk_sampling_log_softmax_f32(
        ptr(out),
        out.length
    );

    return out;
}

/**
 * Scales logits by `1 / temperature`. Temperatures above 1 flatten the
 * distribution; temperatures below 1 sharpen it.
 *
 * @param logits - Raw logits (not mutated).
 * @param t - Temperature, must be a positive finite number.
 * @returns A new Float32Array with each logit divided by `t`.
 * @throws {Error} If `logits` is empty or `t` is not positive.
 */
export function temperature(
    logits: Float32Array,
    t: number
): Float32Array {
    if (logits.length === 0) {
        throw new Error("Vector must not be empty");
    }
    if (typeof t !== "number" || !Number.isFinite(t) || t <= 0) {
        throw new Error("temperature must be a positive finite number");
    }

    const out = new Float32Array(logits);

    nativeSampling.symbols.rk_sampling_temperature_f32(
        ptr(out),
        t,
        out.length
    );

    return out;
}

/**
 * Keeps only the `k` largest logits and sets every other element to
 * `-Infinity`, so it composes directly with `softmax`.
 *
 * @param logits - Raw logits (not mutated).
 * @param k - Number of logits to keep, an integer in `[1, logits.length]`.
 * @returns A new Float32Array with non-top-k entries set to `-Infinity`.
 * @throws {Error} If `logits` is empty or `k` is out of range.
 */
export function topK(
    logits: Float32Array,
    k: number
): Float32Array {
    if (logits.length === 0) {
        throw new Error("Vector must not be empty");
    }
    if (!Number.isInteger(k) || k < 1 || k > logits.length) {
        throw new Error("k must be an integer between 1 and logits.length");
    }

    const out = new Float32Array(logits);

    nativeSampling.symbols.rk_sampling_top_k_f32(
        ptr(out),
        k,
        out.length
    );

    return out;
}

/**
 * Nucleus sampling. Given a probability distribution, keeps the smallest set
 * of tokens whose cumulative probability reaches `p`, zeroes the rest, and
 * renormalizes.
 *
 * @param probs - Probability distribution (not mutated).
 * @param p - Cumulative probability threshold in `[0, 1]`.
 * @returns A new Float32Array of renormalized probabilities.
 * @throws {Error} If `probs` is empty or `p` is out of range.
 */
export function topP(
    probs: Float32Array,
    p: number
): Float32Array {
    if (probs.length === 0) {
        throw new Error("Vector must not be empty");
    }
    if (typeof p !== "number" || !Number.isFinite(p) || p < 0 || p > 1) {
        throw new Error("p must be a number between 0 and 1");
    }

    const out = new Float32Array(probs);

    nativeSampling.symbols.rk_sampling_top_p_f32(
        ptr(out),
        p,
        out.length
    );

    return out;
}

/**
 * Min-p sampling. Given a probability distribution, keeps tokens with
 * probability at least `p * max(probs)`, zeroes the rest, and renormalizes.
 *
 * @param probs - Probability distribution (not mutated).
 * @param p - Minimum probability multiplier in `[0, 1]`.
 * @returns A new Float32Array of renormalized probabilities.
 * @throws {Error} If `probs` is empty or `p` is out of range.
 */
export function minP(
    probs: Float32Array,
    p: number
): Float32Array {
    if (probs.length === 0) {
        throw new Error("Vector must not be empty");
    }
    if (typeof p !== "number" || !Number.isFinite(p) || p < 0 || p > 1) {
        throw new Error("p must be a number between 0 and 1");
    }

    const out = new Float32Array(probs);

    nativeSampling.symbols.rk_sampling_min_p_f32(
        ptr(out),
        p,
        out.length
    );

    return out;
}

// Bun's `ptr()` rejects empty typed arrays (null backing pointer), so pass a
// dummy 1-element buffer when `seen` is empty and rely on the length argument.
const EMPTY_SEEN = new Uint32Array(1);

function ffiSeenPtr(seen: Uint32Array) {
    return seen.length === 0 ? ptr(EMPTY_SEEN) : ptr(seen);
}

/**
 * Applies a repetition penalty to the logits of tokens whose ids appear in
 * `seen`. Positive logits are divided by `penalty`, negative logits are
 * multiplied by it. A penalty of 1 is the identity.
 *
 * @param logits - Raw logits (not mutated).
 * @param penalty - Non-negative penalty factor.
 * @param seen - Token ids to penalize.
 * @returns A new Float32Array with the penalty applied.
 * @throws {Error} If `logits` is empty, `penalty` is invalid, or `seen`
 * contains an out-of-range index.
 */
export function repetitionPenalty(
    logits: Float32Array,
    penalty: number,
    seen: Uint32Array
): Float32Array {
    if (logits.length === 0) {
        throw new Error("Vector must not be empty");
    }
    if (typeof penalty !== "number" || !Number.isFinite(penalty) || penalty < 0) {
        throw new Error("penalty must be a non-negative finite number");
    }
    for (const idx of seen) {
        if (idx >= logits.length) {
            throw new Error("seen contains an index out of range");
        }
    }

    const out = new Float32Array(logits);

    nativeSampling.symbols.rk_sampling_repetition_penalty_f32(
        ptr(out),
        out.length,
        penalty,
        ffiSeenPtr(seen),
        seen.length
    );

    return out;
}

/**
 * Draws a categorical sample from a probability distribution using a seeded
 * PRNG. The result is deterministic for a given `seed`.
 *
 * @param probs - Probability distribution.
 * @param seed - Non-negative integer seed.
 * @returns The sampled index into `probs`.
 * @throws {Error} If `probs` is empty or `seed` is invalid.
 */
export function categorical(
    probs: Float32Array,
    seed: number
): number {
    if (probs.length === 0) {
        throw new Error("Vector must not be empty");
    }
    if (!Number.isInteger(seed) || seed < 0) {
        throw new Error("seed must be a non-negative integer");
    }

    return Number(nativeSampling.symbols.rk_sampling_categorical_f32(
        ptr(probs),
        probs.length,
        seed
    ));
}

/**
 * Returns the index of the largest logit (greedy decoding).
 *
 * @param logits - Raw logits.
 * @returns The index of the maximum logit.
 * @throws {Error} If `logits` is empty.
 */
export function greedy(
    logits: Float32Array
): number {
    if (logits.length === 0) {
        throw new Error("Vector must not be empty");
    }

    return Number(nativeSampling.symbols.rk_sampling_greedy_f32(
        ptr(logits),
        logits.length
    ));
}