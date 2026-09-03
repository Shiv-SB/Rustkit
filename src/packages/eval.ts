import { nativeEval, ptr } from "../native";

// Bun's `ptr()` rejects empty typed arrays (null backing pointer), so pass a
// dummy 1-byte buffer when the input is empty and rely on the length argument.
const EMPTY = new Uint8Array(1);

function ffiPtr(bytes: Uint8Array) {
    return bytes.length === 0 ? ptr(EMPTY) : ptr(bytes);
}

/**
 * Perplexity of a sequence of log-probabilities: `exp(-mean(log_prob))`.
 * A uniform 2-way distribution scores 2; a perfectly confident model scores 1.
 *
 * @param logProbs - Log-probabilities of the generated tokens.
 * @returns The perplexity.
 * @throws {Error} If `logProbs` is empty.
 */
export function perplexity(
    logProbs: Float32Array
): number {
    if (logProbs.length === 0) {
        throw new Error("Vector must not be empty");
    }

    return nativeEval.symbols.rk_eval_perplexity_f32(
        ptr(logProbs),
        logProbs.length
    );
}

/**
 * BLEU score of `hypothesis` against `reference` using n-grams up to `maxN`
 * (whitespace tokenization), including the brevity penalty.
 *
 * @param reference - Reference text.
 * @param hypothesis - Candidate text.
 * @param maxN - Maximum n-gram order, a positive integer (default 4).
 * @returns The BLEU score in `[0, 1]`.
 * @throws {Error} If `maxN` is not a positive integer.
 */
export function bleu(
    reference: string,
    hypothesis: string,
    maxN = 4
): number {
    if (!Number.isInteger(maxN) || maxN < 1) {
        throw new Error("maxN must be a positive integer");
    }

    const encoder = new TextEncoder();

    const referenceBytes = encoder.encode(reference);
    const hypothesisBytes = encoder.encode(hypothesis);

    return nativeEval.symbols.rk_eval_bleu(
        ffiPtr(referenceBytes),
        referenceBytes.length,
        ffiPtr(hypothesisBytes),
        hypothesisBytes.length,
        maxN
    );
}

/**
 * ROUGE-L F-measure between `hypothesis` and `reference`, based on the
 * longest common subsequence of whitespace-tokenized tokens.
 *
 * @param reference - Reference text.
 * @param hypothesis - Candidate text.
 * @returns The ROUGE-L F-measure in `[0, 1]`.
 */
export function rougeL(
    reference: string,
    hypothesis: string
): number {
    const encoder = new TextEncoder();

    const referenceBytes = encoder.encode(reference);
    const hypothesisBytes = encoder.encode(hypothesis);

    return nativeEval.symbols.rk_eval_rouge_l(
        ffiPtr(referenceBytes),
        referenceBytes.length,
        ffiPtr(hypothesisBytes),
        hypothesisBytes.length
    );
}

/**
 * SQuAD-style token F1 between two token-id sequences, computed from shared
 * tokens (counting duplicates).
 *
 * @param reference - Reference token ids.
 * @param hypothesis - Candidate token ids.
 * @returns The token F1 score in `[0, 1]`.
 * @throws {Error} If either token array is empty.
 */
export function tokenF1(
    reference: Int32Array,
    hypothesis: Int32Array
): number {
    if (reference.length === 0 || hypothesis.length === 0) {
        throw new Error("Token arrays must not be empty");
    }

    return nativeEval.symbols.rk_eval_token_f1_i32(
        ptr(reference),
        reference.length,
        ptr(hypothesis),
        hypothesis.length
    );
}

/**
 * Byte-for-byte exact-match comparison of two texts.
 *
 * @param reference - Reference text.
 * @param hypothesis - Candidate text.
 * @returns `true` if the texts are identical, `false` otherwise.
 */
export function exactMatch(
    reference: string,
    hypothesis: string
): boolean {
    const encoder = new TextEncoder();

    const referenceBytes = encoder.encode(reference);
    const hypothesisBytes = encoder.encode(hypothesis);

    return nativeEval.symbols.rk_eval_exact_match(
        ffiPtr(referenceBytes),
        referenceBytes.length,
        ffiPtr(hypothesisBytes),
        hypothesisBytes.length
    );
}