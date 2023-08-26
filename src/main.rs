//! Requires the "client", "standard_framework", and "voice" features be enabled in your
//! Cargo.toml, like so:
//!
//! ```toml
//! [dependencies.serenity]
//! git = "https://github.com/serenity-rs/serenity.git"
//! features = ["client", "standard_framework", "voice"]
//! ```
mod error_handling;
mod ping;
mod play;
mod queue;
mod pause;
use dotenv::dotenv;
use std::env;
mod handlers;
// This trait adds the `register_songbird` and `register_songbird_with` methods
// to the client builder below, making it easy to install this voice client.
// The voice client can be retrieved in any command using `songbird::get(ctx).await`.
use songbird::SerenityInit;

use error_handling::check_msg;

use serenity::{
    async_trait,
    client::{Client, Context, EventHandler},
    framework::{
        standard::{
            macros::{command, group},
            CommandResult,
        },
        StandardFramework,
    },
    model::{channel::Message, gateway::Ready},
    prelude::GatewayIntents,
};

struct Handler;

#[async_trait]
impl EventHandler for Handler {
    async fn ready(&self, _: Context, ready: Ready) {
        println!("{} is connected!", ready.user.name);
    }
}

use crate::ping::PING_COMMAND;
use crate::play::PLAY_COMMAND;
use crate::pause::PAUSE_COMMAND;
use crate::pause::RESUME_COMMAND;

#[group]
#[commands(join, play, ping, pause, resume)]

struct General;

#[tokio::main]
async fn main() {
    dotenv().ok();
    tracing_subscriber::fmt::init();

    // Configure the client with your Discord bot token in the environment.
    let token = env::var("DISCORD_TOKEN").expect("Expected a token in the environment");

    let framework = StandardFramework::new()
        .configure(|c| c.prefix("/"))
        .group(&GENERAL_GROUP);

    let intents = GatewayIntents::non_privileged()
        | GatewayIntents::MESSAGE_CONTENT
        | GatewayIntents::GUILD_MESSAGES
        | GatewayIntents::DIRECT_MESSAGES;

    let mut client = Client::builder(&token, intents)
        .event_handler(Handler)
        .framework(framework)
        .type_map_insert::<queue::QueueManagerKey>(queue::QueueManager::default())
        .register_songbird()
        .await
        .expect("Err creating client");

    tokio::spawn(async move {
        let _ = client
            .start()
            .await
            .map_err(|why| println!("Client ended: {:?}", why));
    });

    println!("Initialization finished, awaiting exit");
    let _ = tokio::signal::ctrl_c().await;
    println!("Received Ctrl-C, shutting down.");
}

#[command]
#[only_in(guilds)]
async fn join(ctx: &Context, msg: &Message) -> CommandResult {
    let guild = msg.guild(&ctx.cache).unwrap();
    let guild_id = guild.id;

    let channel_id = guild
        .voice_states
        .get(&msg.author.id)
        .and_then(|voice_state| voice_state.channel_id);

    let connect_to = match channel_id {
        Some(channel) => channel,
        None => {
            check_msg(msg.reply(ctx, "Not in a voice channel").await);

            return Ok(());
        }
    };

    let manager = songbird::get(ctx)
        .await
        .expect("Songbird Voice client placed in at initialisation.")
        .clone();

    manager.join(guild_id, connect_to).await.1.unwrap();
    println!("Joined call");

    if let Some(call) = manager.get(guild_id) {
        let mut handler = call.lock().await;

        println!("Got handle");

        handler.remove_all_global_events();

        println!("Removed all events");

        handler.add_global_event(
            songbird::events::Event::Track(songbird::events::TrackEvent::End),
            handlers::SongEndHandler {
                context_data: ctx.data.clone(),
            },
        );

        println!("Subscribed song end");

        handler.add_global_event(
            songbird::events::Event::Track(songbird::events::TrackEvent::Play),
            handlers::SongStartHandler {
            },
        );

        println!("Subscribed song start");
    }

    Ok(())
}
