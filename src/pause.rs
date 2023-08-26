use serenity::{
    client::Context,
    framework::standard::CommandResult,
    model::channel::Message,
};

use crate::queue;
use crate::command;

#[command]
#[only_in(guilds)]
async fn pause(ctx: &Context, _msg: &Message) -> CommandResult {
    let mut data = ctx.data.write().await;
    let Some(queue_data) = data.get_mut::<queue::QueueManagerKey>() else {
        println!("No queue available");
        return Ok(());
    };

    match queue_data.current {
        Some(ref mut current) => {
            match current.pause() {
                Ok(_) => {},
                Err(_) => println!("Error pausing song"),
            }
            println!("Pausing song");
        },
        None => println!("No song playing"),
    };

    Ok(())
}

#[command]
#[only_in(guilds)]
async fn resume(ctx: &Context, _msg: &Message) -> CommandResult {
    let mut data = ctx.data.write().await;
    let Some(queue_data) = data.get_mut::<queue::QueueManagerKey>() else {
        println!("No queue available");
        return Ok(());
    };

    match queue_data.current {
        Some(ref mut current) => {
            match current.play() {
                Ok(_) => {},
                Err(_) => println!("Error resuming song"),
            }
            println!("Resuming song");
        },
        None => println!("No song playing"),
    };

    Ok(())
}
