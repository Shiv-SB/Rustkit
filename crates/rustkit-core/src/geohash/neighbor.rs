use crate::geohash::decode::decode_bounds;
use crate::geohash::encode::encode;

/// Directions: 0=N, 1=S, 2=E, 3=W, 4=NE, 5=NW, 6=SE, 7=SW.
pub fn neighbor(hash: &[u8], direction: i32, out: &mut [u8]) {
    assert_eq!(out.len(), hash.len());

    let (lat_min, lng_min, lat_max, lng_max) = decode_bounds(hash);
    let lat_center = (lat_min + lat_max) / 2.0;
    let lng_center = (lng_min + lng_max) / 2.0;
    let lat_span = lat_max - lat_min;
    let lng_span = lng_max - lng_min;

    let mut lat = lat_center;
    let mut lng = lng_center;

    match direction {
        0 => lat += lat_span,
        1 => lat -= lat_span,
        2 => lng += lng_span,
        3 => lng -= lng_span,
        4 => {
            lat += lat_span;
            lng += lng_span;
        }
        5 => {
            lat += lat_span;
            lng -= lng_span;
        }
        6 => {
            lat -= lat_span;
            lng += lng_span;
        }
        7 => {
            lat -= lat_span;
            lng -= lng_span;
        }
        _ => {}
    }

    lat = lat.clamp(-90.0, 90.0);
    if lng > 180.0 {
        lng -= 360.0;
    } else if lng < -180.0 {
        lng += 360.0;
    }

    encode(lat, lng, hash.len(), out);
}
