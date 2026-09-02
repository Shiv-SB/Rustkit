use std::cmp::Ordering;

/// Writes the indices that would sort `a` in ascending order.
///
/// The index type is `u32` to match the FFI buffer provided by the
/// TypeScript wrapper (`Uint32Array`).
pub fn argsort_f32(a: &[f32], out: &mut [u32]) {
    assert_eq!(a.len(), out.len());

    for (i, o) in out.iter_mut().enumerate() {
        *o = i as u32;
    }

    out.sort_by(|&i, &j| {
        a[i as usize]
            .partial_cmp(&a[j as usize])
            .unwrap_or(Ordering::Equal)
    });
}
