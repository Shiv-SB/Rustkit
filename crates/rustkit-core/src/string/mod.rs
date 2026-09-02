pub mod levenshtein;
pub mod hamming;
pub mod fuzzy_match;
pub mod longest_common_subseq;
pub mod longest_common_substr;

pub use levenshtein::levenshtein;
pub use hamming::hamming;
pub use fuzzy_match::fuzzy_match;
pub use longest_common_subseq::longest_common_subseq;
pub use longest_common_substr::longest_common_substr;

pub mod damerau_levenshtein;
pub mod jaro_winkler;
pub mod trigram_similarity;
pub mod soundex;

pub use damerau_levenshtein::damerau_levenshtein;
pub use jaro_winkler::jaro_winkler;
pub use trigram_similarity::trigram_similarity;
pub use soundex::soundex;
