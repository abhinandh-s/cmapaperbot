use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn privacy_policy() -> String {
    include_str!("../docs/privacy.md").into()
}

#[wasm_bindgen]
pub fn support() -> String {
    include_str!("../docs/support.md").into()
}

#[wasm_bindgen]
pub fn status() -> String {
    include_str!("../docs/status.md").into()
}

#[wasm_bindgen]
pub fn help() -> String {
    include_str!("../docs/help.md").into()
}


#[wasm_bindgen]
pub fn start() -> String {
    include_str!("../docs/start.txt").into()
}