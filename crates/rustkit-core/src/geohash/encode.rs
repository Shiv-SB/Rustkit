const BASE32: &[u8; 32] = b"0123456789bcdefghjkmnpqrstuvwxyz";

pub fn encode(lat: f64, lng: f64, precision: usize, out: &mut [u8]) {
    assert_eq!(out.len(), precision);

    let mut lat_min = -90.0;
    let mut lat_max = 90.0;
    let mut lng_min = -180.0;
    let mut lng_max = 180.0;

    let mut ch = 0u8;
    let mut bit = 0usize;
    let mut is_lng = true;
    let mut out_idx = 0;

    while out_idx < precision {
        if is_lng {
            let mid = (lng_min + lng_max) / 2.0;
            if lng >= mid {
                ch |= 1 << (4 - bit);
                lng_min = mid;
            } else {
                lng_max = mid;
            }
        } else {
            let mid = (lat_min + lat_max) / 2.0;
            if lat >= mid {
                ch |= 1 << (4 - bit);
                lat_min = mid;
            } else {
                lat_max = mid;
            }
        }

        is_lng = !is_lng;
        bit += 1;

        if bit == 5 {
            out[out_idx] = BASE32[ch as usize];
            out_idx += 1;
            bit = 0;
            ch = 0;
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn encodes_known_locations() {
        let mut out = [0u8; 5];
        encode(0.0, 0.0, 5, &mut out);
        assert_eq!(&out, b"s0000");
    }
}
