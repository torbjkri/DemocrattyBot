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
            EventContext::Track(&[_track]) => {
                let type_lock = self.context_data.write().await;
                if let Some(queue_manager) = type_lock.get::<queue::QueueManagerKey>() {
                    println!("There are {} elements in queue", queue_manager.queue.len());
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