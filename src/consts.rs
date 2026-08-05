use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn privacy_policy() -> String {
    include_str!("../docs/privacy.md").into()
}