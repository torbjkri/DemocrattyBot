use songbird::typemap::TypeMapKey;

pub struct PinisReporter;

impl TypeMapKey for PinisReporter {
    type Value = String;
}
