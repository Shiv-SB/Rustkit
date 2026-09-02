pub mod mean;
pub mod median;
pub mod variance;
pub mod stddev;
pub mod percentile;
pub mod covariance;
pub mod correlation;
pub mod zscore;
pub mod histogram;
pub mod quantile;

pub use mean::mean_f32;
pub use median::median_f32;
pub use variance::variance_f32;
pub use stddev::stddev_f32;
pub use percentile::percentile_f32;
pub use covariance::covariance_f32;
pub use correlation::correlation_f32;
pub use zscore::zscore_f32;
pub use histogram::histogram_f32;
pub use quantile::quantile_f32;

pub mod mode;
pub mod skewness;
pub mod kurtosis;
pub mod geometric_mean;
pub mod weighted_mean;
pub mod iqr;

pub use mode::mode_f32;
pub use skewness::skewness_f32;
pub use kurtosis::kurtosis_f32;
pub use geometric_mean::geometric_mean_f32;
pub use weighted_mean::weighted_mean_f32;
pub use iqr::iqr_f32;
