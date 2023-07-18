use std::sync::Arc;
use songbird::events::{EventHandler, EventContext, Event};
use songbird::typemap::TypeMap;
use serenity::async_trait;
use serenity::prelude::RwLock;

pub struct SongEndHandler {
    pub context_data: Arc<RwLock<TypeMap>>
}

pub struct SongStartHandler {

}

#[async_trait]
impl EventHandler for SongEndHandler {
    async fn act(&self, _context: &EventContext<'_>) -> Option<Event> {
        println!("Song ended wooop");
        None
    }
}

#[async_trait]
impl EventHandler for SongStartHandler {
    async fn act(&self, _context: &EventContext<'_>) -> Option<Event> {
        println!("Song Started wooop");
        None
    }
}