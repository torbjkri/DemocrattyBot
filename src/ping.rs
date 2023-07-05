use serenity::{
    client:: Context,
    model::channel::Message,
    framework::standard::{
        CommandResult,
    }
};

use crate::queue;

use crate::command;

use crate::error_handling;


#[command]
pub async fn ping(context: &Context, msg: &Message) -> CommandResult {
    println!("Ping command received");
    error_handling::check_msg(msg.channel_id.say(&context.http, "Pong!").await);

    let mut data =  context.data.write().await;
    let pinis = data.get_mut::<queue::PinisReporter>().expect("Expected a pinis");
    println!("We have a {}", pinis);

    Ok(())
}
