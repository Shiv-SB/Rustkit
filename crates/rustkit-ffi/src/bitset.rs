#[unsafe(no_mangle)]
pub unsafe extern "C" fn rk_bitset_new(bits: *mut u64, len: usize) {
    if bits.is_null() {
        return;
    }

    let bits_slice = unsafe { std::slice::from_raw_parts_mut(bits, len) };

    rustkit_core::bitset::new_bitset(bits_slice);
}

#[unsafe(no_mangle)]
pub unsafe extern "C" fn rk_bitset_set(bits: *mut u64, len: usize, index: usize) {
    if bits.is_null() || index >= len * 64 {
        return;
    }

    let bits_slice = unsafe { std::slice::from_raw_parts_mut(bits, len) };

    rustkit_core::bitset::set_bit(bits_slice, index);
}

#[unsafe(no_mangle)]
pub unsafe extern "C" fn rk_bitset_clear(bits: *mut u64, len: usize, index: usize) {
    if bits.is_null() || index >= len * 64 {
        return;
    }

    let bits_slice = unsafe { std::slice::from_raw_parts_mut(bits, len) };

    rustkit_core::bitset::clear_bit(bits_slice, index);
}

#[unsafe(no_mangle)]
pub unsafe extern "C" fn rk_bitset_toggle(bits: *mut u64, len: usize, index: usize) {
    if bits.is_null() || index >= len * 64 {
        return;
    }

    let bits_slice = unsafe { std::slice::from_raw_parts_mut(bits, len) };

    rustkit_core::bitset::toggle_bit(bits_slice, index);
}

#[unsafe(no_mangle)]
pub unsafe extern "C" fn rk_bitset_popcount(bits: *const u64, len: usize) -> u32 {
    if bits.is_null() {
        return 0;
    }

    let bits_slice = unsafe { std::slice::from_raw_parts(bits, len) };

    rustkit_core::bitset::popcount(bits_slice)
}

#[unsafe(no_mangle)]
pub unsafe extern "C" fn rk_bitset_and(
    a: *const u64,
    b: *const u64,
    out: *mut u64,
    len: usize,
) {
    if a.is_null() || b.is_null() || out.is_null() {
        return;
    }

    let a_slice = unsafe { std::slice::from_raw_parts(a, len) };
    let b_slice = unsafe { std::slice::from_raw_parts(b, len) };
    let out_slice = unsafe { std::slice::from_raw_parts_mut(out, len) };

    rustkit_core::bitset::bitset_and(a_slice, b_slice, out_slice);
}

#[unsafe(no_mangle)]
pub unsafe extern "C" fn rk_bitset_or(
    a: *const u64,
    b: *const u64,
    out: *mut u64,
    len: usize,
) {
    if a.is_null() || b.is_null() || out.is_null() {
        return;
    }

    let a_slice = unsafe { std::slice::from_raw_parts(a, len) };
    let b_slice = unsafe { std::slice::from_raw_parts(b, len) };
    let out_slice = unsafe { std::slice::from_raw_parts_mut(out, len) };

    rustkit_core::bitset::bitset_or(a_slice, b_slice, out_slice);
}

#[unsafe(no_mangle)]
pub unsafe extern "C" fn rk_bitset_xor(
    a: *const u64,
    b: *const u64,
    out: *mut u64,
    len: usize,
) {
    if a.is_null() || b.is_null() || out.is_null() {
        return;
    }

    let a_slice = unsafe { std::slice::from_raw_parts(a, len) };
    let b_slice = unsafe { std::slice::from_raw_parts(b, len) };
    let out_slice = unsafe { std::slice::from_raw_parts_mut(out, len) };

    rustkit_core::bitset::bitset_xor(a_slice, b_slice, out_slice);
}

#[unsafe(no_mangle)]
pub unsafe extern "C" fn rk_bitset_next_set_bit(
    bits: *const u64,
    len: usize,
    from: usize,
    out: *mut usize,
) -> bool {
    if bits.is_null() || out.is_null() {
        return false;
    }

    let bits_slice = unsafe { std::slice::from_raw_parts(bits, len) };

    match rustkit_core::bitset::next_set_bit(bits_slice, from) {
        Some(idx) => {
            unsafe { *out = idx; }
            true
        }
        None => false,
    }
}

#[unsafe(no_mangle)]
pub unsafe extern "C" fn rk_bitset_cardinality(bits: *const u64, len: usize) -> u64 {
    if bits.is_null() {
        return 0;
    }

    let bits_slice = unsafe { std::slice::from_raw_parts(bits, len) };

    rustkit_core::bitset::cardinality(bits_slice)
}
