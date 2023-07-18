use std::sync::Arc;
use songbird::events::{EventHandler, EventContext, Event};
use songbird::typemap::TypeMap;
use serenity::async_trait;
use serenity::prelude::RwLock;

use crate::queue;

pub struct SongEndHandler {
    pub context_data: Arc<RwLock<TypeMap>>
}

pub struct SongStartHandler {

}

#[async_trait]
impl EventHandler for SongEndHandler {
    async fn act(&self, context: &EventContext<'_>) -> Option<Event> {
        println!("Song ended wooop");

        match context {
            EventContext::Track(&[track]) => {
                let handle = track.1;
                let type_lock = handle.typemap().read().await;
                if let Some(val) = type_lock.get::<queue::Pinis>() {
                    println!("We found: {:?}", val);
                } else {
                    println!("Didnt find any type map");
                }
            }

            _ => ()
        }
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