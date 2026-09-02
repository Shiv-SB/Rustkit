use std::collections::HashSet;

pub fn jaccard_similarity_i32(a: &[i32], b: &[i32]) -> f32 {
    let set_a: HashSet<i32> = a.iter().copied().collect();
    let set_b: HashSet<i32> = b.iter().copied().collect();

    let intersection = set_a.intersection(&set_b).count();
    let union = set_a.len() + set_b.len() - intersection;

    if union == 0 {
        return 1.0;
    }

    intersection as f32 / union as f32
}