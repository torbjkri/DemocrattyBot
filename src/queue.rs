use songbird::typemap::TypeMapKey;
use serenity::model::channel::Message;

pub struct QueueManagerKey;

#[derive(Clone)]
pub struct Track {
    pub msg: Message,
    pub url: String
}

impl Track {
    pub fn new(msg: Message, url: String) -> Self {
        Self {
            msg,
            url
        }
    }
}

#[derive(Default)]
pub struct QueueManager {
    pub current: Option<Track>,
    pub queue: Vec<Track>,
}

impl TypeMapKey for QueueManagerKey {
    type Value = QueueManager;
}
