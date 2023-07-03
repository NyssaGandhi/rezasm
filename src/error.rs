use std::error::Error;
use std::num::{ParseFloatError, ParseIntError};

#[derive(Debug)]
pub enum EzasmError {
    ParserError,
}

impl From<ParseFloatError> for EzasmError {
    fn from(err: ParseFloatError) -> Self {
        EzasmError::ParserError
    }
}

impl From<ParseIntError> for EzasmError {
    fn from(err: ParseIntError) -> Self {
        EzasmError::ParserError
    }
}
