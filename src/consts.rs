use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn privacy_policy() -> String {
    include_str!("../docs/privacy.md").into()
}

#[wasm_bindgen]
pub fn support() -> String {
    include_str!("../docs/support.md").into()
}