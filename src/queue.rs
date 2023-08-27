use std::collections::VecDeque;

use songbird::typemap::TypeMapKey;
use serenity::model::channel::Message;
use songbird::tracks::TrackHandle;

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

pub struct Pinis;

impl TypeMapKey for Pinis {
    type Value = i32;
}

#[derive(Default)]
pub struct QueueManager {
    pub current: Option<TrackHandle>,
    pub queue: VecDeque<Track>,
}

impl TypeMapKey for QueueManagerKey {
    type Value = QueueManager;
}
