use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn privacy_policy() -> &'static str {
    include_str!("../docs/privacy.md")
}