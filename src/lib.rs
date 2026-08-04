use wasm_bindgen::prelude::*;

// ```ts
// export function renderSet(id: string): string;
// ```
#[wasm_bindgen(js_name = renderSet)]
pub fn render_set(id: &str) -> String {
    let result = match id {
        "s1" => "set: 1",
        "s2" => "set: 2",
        "s1a" => "set: 1 solution",
        "s2a" => "set: 2 solution",
        "q" => "type: Question Paper",
        "a" => "type: Answer Key",
        "sa" => "type: Suggested Answer",
        _ => id,
    };
    result.into()
}
// ```ts
// export function level_in_blockquotes(id: string): string;
// ```
#[wasm_bindgen]
pub fn level_in_blockquotes(id: &str) -> String {
    let level = level_of(id).to_uppercase();
    format!("<blockquote>CMA {}</blockquote>", level)
}

// ```ts
// export function level_of(id: string): string;
// ```
#[wasm_bindgen]
pub fn level_of(id: &str) -> String {
    let clean_id = if id.starts_with('p') || id.starts_with('P') {
        &id[1..] 
    } else {
        id
    };

    Level::of(clean_id)
        .map(|level| level.to_string())
        .unwrap_or_else(|| "unknown".to_string())
}

#[derive(Debug, PartialEq, Eq)]
struct Paper(&'static str);

impl std::fmt::Display for Paper {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "p{}", self.0)
    }
}

macro_rules! gen_papers {
    ( $($id:ident),* $(,)? ) => {
        $(
            // stringify!($id) produces "P20A".
            // .split_at(1) returns the tuple ("P", "20A").
            // .1 takes the second part of that tuple at compile time.
            const $id: Paper = Paper(stringify!($id).split_at(1).1);
        )*
    };
}

gen_papers! {
    P1, P2, P3, P4, P5, P6, P7, P8, P9, P10,
    P11, P12, P13, P14, P15, P16, P17, P18, P19, P20,
    P20A, P20B, P20C
}

// ```ts
// export enum Level {
//   Foundation = 0,
//   Intermediate = 1,
//   Final = 2,
// }
// ```
#[wasm_bindgen]
#[derive(Debug, PartialEq, Eq)]
pub enum Level {
    Foundation,
    Intermediate,
    Final,
}
impl std::fmt::Display for Level {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(
            f,
            "{}",
            match self {
                &FOUNDATION => "foundation",
                &INTERMEDIATE => "intermediate",
                &FINAL => "final",
            }
        )
    }
}
const FOUNDATION: Level = Level::Foundation;
const INTERMEDIATE: Level = Level::Intermediate;
const FINAL: Level = Level::Final;
impl Level {
    fn papers<T: Syllabus>(self, _s: T) -> &'static [Paper] {
        match self {
            FOUNDATION => T::foundation(),
            INTERMEDIATE => T::intermediate(),
            FINAL => T::r#final(),
        }
    }

    fn of(id: &str) -> Option<Level> {
        if L1.iter().any(|p| p.0 == id) {
            Some(Level::Foundation)
        } else if L2.iter().any(|p| p.0 == id) {
            Some(Level::Intermediate)
        } else if L3.iter().any(|p| p.0 == id) {
            Some(Level::Final)
        } else {
            None
        }
    }
}

macro_rules! define_levels {
    (
        $l1:ident = [$($p1:ident),* $(,)?];
        $l2:ident = [$($p2:ident),* $(,)?];
        $l3:ident = [$($p3:ident),* $(,)?];
        $all:ident
    ) => {
        const $l1: &'static [Paper] = &[$($p1),*];
        const $l2: &'static [Paper] = &[$($p2),*];
        const $l3: &'static [Paper] = &[$($p3),*];
        // The macro seamlessly merges them into one flat array here!
        const $all: &'static [Paper] = &[$($p1),*, $($p2),*, $($p3),*];
    };
}

define_levels! {
    L1 = [P1, P2, P3, P4];
    L2 = [P5, P6, P7, P8, P9, P10, P11, P12];
    L3 = [P13, P14, P15, P16, P17, P18, P19, P20, P20A, P20B, P20C];
    PAPERS
}

trait Syllabus {
    fn syllabus() -> u16;
    fn foundation() -> &'static [Paper];
    fn intermediate() -> &'static [Paper];
    fn r#final() -> &'static [Paper];

    fn level_of(paper: &Paper) -> Option<Level> {
        if Self::foundation().contains(paper) {
            Some(Level::Foundation)
        } else if Self::intermediate().contains(paper) {
            Some(Level::Intermediate)
        } else if Self::r#final().contains(paper) {
            Some(Level::Final)
        } else {
            None
        }
    }
}
// #[custom(2022, or something)]
struct Syllabus2022;
impl Syllabus for Syllabus2022 {
    fn syllabus() -> u16 {
        2022
    }

    fn foundation() -> &'static [Paper] {
        &[P1, P2, P3, P4]
    }

    fn intermediate() -> &'static [Paper] {
        &[P5, P6, P7, P8, P9, P10, P11, P12]
    }

    fn r#final() -> &'static [Paper] {
        &[P13, P14, P15, P16, P17, P18, P19, P20A, P20B, P20C]
    }
}
struct Syllabus2016;
impl Syllabus for Syllabus2016 {
    fn syllabus() -> u16 {
        2016
    }

    fn foundation() -> &'static [Paper] {
        &[P1, P2, P3, P4]
    }

    fn intermediate() -> &'static [Paper] {
        &[P5, P6, P7, P8, P9, P10, P11, P12]
    }

    fn r#final() -> &'static [Paper] {
        &[P13, P14, P15, P16, P17, P18, P19, P20]
    }
}


/*
fn main() {
    for i in Syllabus2022::r#final() {
        println!("{i}");
    }
    // via enums
    for i in FINAL.papers(Syllabus2022) {
        println!("{i}");
    }

    if let Some(level) = Level::of("20B") {
        println!("{} belongs to {:?}", P20B, level);
    }
    let level = level_of("P20");
    println!("{level}");
}

#[derive(Debug, PartialEq, Eq, Clone, Copy)]
enum DocType {
    Pyq,
    Mqp,
    Ptp,
}

impl DocType {
    // only matches exact word
    fn from_str(word: &str) -> Option<DocType> {
        match word {
            "pyq" | "pyqs" | "previous" => Some(DocType::Pyq),
            "mqp" | "mqps" | "model" | "mock" => Some(DocType::Mqp),
            "ptp" | "ptps" | "practice" => Some(DocType::Ptp),
            _ => None,
        }
    }
}

fn detect_doc_type(text: &str) -> Option<DocType> {
    text.split_whitespace().find_map(DocType::from_str)
}
macro_rules! paper_words {
    ( $($s:literal),* $(,)? ) => {
        fn paper_from_str(word: &str) -> Option<&str> {
            match word {
                $(
                    stringify!($s) | concat!("p", $s) => Some(concat!("p", $s)),
                )*
                _ => None,
            }
        }
    };
}

paper_words! {
        1, 2, 3, 4
}

fn detect_paper(text: &str) -> Option<&str> {
    text.split_whitespace().find_map(paper_from_str)
}

fn main() {
    let text = "this is p2 a mock test paper";

    let doc_type = detect_doc_type(text);

    assert_eq!(doc_type, Some(DocType::Mqp));
    println!("Detected: {:?}", doc_type);

    let result = detect_paper(text);

    assert_eq!(result, Some("p2"));
    println!("{:?}", result);
}

*/