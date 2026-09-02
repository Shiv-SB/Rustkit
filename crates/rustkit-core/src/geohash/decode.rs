const BASE32: &[u8; 32] = b"0123456789bcdefghjkmnpqrstuvwxyz";

/// Decodes the cell bounds of a geohash, returning
/// `(min_lat, min_lng, max_lat, max_lng)`.
pub fn decode_bounds(hash: &[u8]) -> (f64, f64, f64, f64) {
    let mut lat_min = -90.0;
    let mut lat_max = 90.0;
    let mut lng_min = -180.0;
    let mut lng_max = 180.0;

    let mut is_lng = true;

    for &c in hash {
        let Some(idx) = BASE32.iter().position(|&b| b == c) else {
            continue;
        };

        for bit in (0..5).rev() {
            let mask = 1 << bit;
            if is_lng {
                let mid = (lng_min + lng_max) / 2.0;
                if idx & mask != 0 {
                    lng_min = mid;
                } else {
                    lng_max = mid;
                }
            } else {
                let mid = (lat_min + lat_max) / 2.0;
                if idx & mask != 0 {
                    lat_min = mid;
                } else {
                    lat_max = mid;
                }
            }
            is_lng = !is_lng;
        }
    }

    (lat_min, lng_min, lat_max, lng_max)
}

pub fn decode(hash: &[u8], lat: &mut f64, lng: &mut f64) {
    let (lat_min, lng_min, lat_max, lng_max) = decode_bounds(hash);
    *lat = (lat_min + lat_max) / 2.0;
    *lng = (lng_min + lng_max) / 2.0;
}
