const EARTH_RADIUS_KM: f64 = 6371.0;

pub fn distance(a_lat: f64, a_lng: f64, b_lat: f64, b_lng: f64) -> f64 {
    let dlat = (b_lat - a_lat).to_radians();
    let dlng = (b_lng - a_lng).to_radians();

    let h = (dlat / 2.0).sin().powi(2)
        + a_lat.to_radians().cos() * b_lat.to_radians().cos() * (dlng / 2.0).sin().powi(2);

    2.0 * EARTH_RADIUS_KM * h.sqrt().asin()
}
