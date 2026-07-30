use wasm_bindgen::prelude::*;

// key!(P5, 2025, d, PYQ, 2022)
//
#[wasm_bindgen]
#[derive(Debug,Eq, PartialEq, Hash)]
pub struct Key<T: Syllabus> {
    pub id: &'static str,
    pub term: Term,
    pub doc: DocType,
    pub syl: T,
}

#[wasm_bindgen]
#[derive(Debug,Eq, PartialEq, Hash)]
pub struct Term {
    pub year: u16,
    pub month: char,
}

#[wasm_bindgen]
#[derive(Debug,Eq, PartialEq, Hash)]
pub enum DocType {
    PYQ,
    MQP,
    PTP,
}