use crate::geohash::decode::decode_bounds;

// Returns (min_lat, min_lng, max_lat, max_lng)
pub fn bbox(hash: &[u8], min_lat: &mut f64, min_lng: &mut f64, max_lat: &mut f64, max_lng: &mut f64) {
    let (lat_min, lng_min, lat_max, lng_max) = decode_bounds(hash);
    *min_lat = lat_min;
    *min_lng = lng_min;
    *max_lat = lat_max;
    *max_lng = lng_max;
}
