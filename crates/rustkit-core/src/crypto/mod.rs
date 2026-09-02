pub mod crc32;
pub mod xxhash64;
pub mod fnv1a;
pub mod blake3;
pub mod murmur3;

pub use crc32::crc32;
pub use xxhash64::xxhash64;
pub use fnv1a::fnv1a;
pub use blake3::blake3;
pub use murmur3::murmur3;
