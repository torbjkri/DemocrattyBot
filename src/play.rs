use serenity::{
    client::Context,
    framework::standard::{Args, CommandResult},
    model::channel::Message,
};

use crate::queue;

use crate::command;

use crate::error_handling::check_msg;

async fn play_song(ctx: &Context, track: &queue::Track) -> CommandResult {
    let guild = track.msg.guild(&ctx.cache).unwrap();
    let guild_id = guild.id;

    let manager = songbird::get(ctx)
        .await
        .expect("Songbird Voice client placed in at initialisation.")
        .clone();

    if let Some(handler_lock) = manager.get(guild_id) {
        let mut handler = handler_lock.lock().await;

        let source = match songbird::ytdl(&track.url).await {
            Ok(source) => source,
            Err(why) => {
                println!("Err starting source: {:?}", why);

                check_msg(track.msg.channel_id.say(&ctx.http, "Error sourcing ffmpeg").await);

                return Ok(());
            }
        };


        handler.play_source(source);

        check_msg(track.msg.channel_id.say(&ctx.http, "Playing song").await);
    } else {
        check_msg(
            track.msg.channel_id
                .say(&ctx.http, "Not in a voice channel to play in")
                .await,
        );
    }

    Ok(())
}

#[command]
#[only_in(guilds)]
async fn play(ctx: &Context, msg: &Message, mut args: Args) -> CommandResult {
    let url = match args.single::<String>() {
        Ok(url) => url,
        Err(_) => {
            check_msg(
                msg.channel_id
                    .say(&ctx.http, "Must provide a URL to a video or audio")
                    .await,
            );

            return Ok(());
        }
    };

    if !url.starts_with("http") {
        check_msg(
            msg.channel_id
                .say(&ctx.http, "Must provide a valid URL")
                .await,
        );
        return Ok(());
    }

    let mut data = ctx.data.write().await;
    let queue = data
        .get_mut::<queue::QueueManagerKey>()
        .expect("Expected a Queue");
    if let Some(track) = &queue.next {
        println!("Next track is {}", track.url);
        queue.current = Some(track.clone());
    } else {
        queue.current = Some(queue::Track::new(msg.clone(), url));
        println!("No current track playing");
    }

    if let Some(track) = &queue.current {
        let _ = play_song(ctx, track).await;
    }
    Ok(())
}
