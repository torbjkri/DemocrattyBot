use serenity::{
    client::Context,
    framework::standard::{Args, CommandResult},
    model::{channel::Message, prelude::GuildId},
};

use crate::queue;

use crate::command;

use crate::error_handling::check_msg;

async fn play_song(ctx: &Context, guild_id: GuildId, url: String) -> Result<(), String> {
    let Some(manager) = songbird::get(ctx).await else {
        return Err("No songbird client available".to_string());
    };

    let Some(call_guard) = manager.get(guild_id) else {
        return Err("Not in a voice channel to play in".to_string());
    };

    let mut call = call_guard.lock().await;

    let source = match songbird::ytdl(&url).await {
        Ok(source) => source,
        Err(why) => {
            return Err(format!("Error sourcing ffmeg: {:?}", why));
        }
    };
    let handle = call.play_source(source);

    let mut type_data = handle.typemap().write().await;
    type_data.insert::<queue::Pinis>(4);

    Ok(())
}

fn is_valid_url(url: &String) -> Result<(), String> {
    if !url.starts_with("http") {
        return Err("Url must start with hppt".to_owned());
    }

    Ok(())
}

fn get_url(args: &mut Args) -> Result<String, String> {
    if args.len() != 1 {
        return Err("Must have exactly one argument".to_owned());
    }

    let url = match args.single::<String>() {
        Ok(url) => url,
        Err(_) => return Err("Error parsing arugment".to_owned()),
    };

    if let Err(e) = is_valid_url(&url) {
        return Err(e);
    }

    Ok(url)
}

async fn add_song_to_queue(ctx: &Context, msg: &Message, url: &String) {
    let mut data = ctx.data.write().await;
    let Some(queue_data) = data.get_mut::<queue::QueueManagerKey>() else {
        println!("No queue available");
        return ();
    };

    let track = queue::Track::new(msg.clone(), url.clone());
    queue_data.queue.push(track);
}

async fn no_song_playing(ctx: &Context) -> bool {
    let mut data = ctx.data.write().await;
    let Some(queue_data) = data.get_mut::<queue::QueueManagerKey>() else {
        println!("No queue available");
        return true;
    };

    match queue_data.current {
        Some(_) => return false,
        None => return true,
    };
}

#[command]
#[only_in(guilds)]
async fn play(ctx: &Context, msg: &Message, mut args: Args) -> CommandResult {
    let url = match get_url(&mut args) {
        Ok(url) => url,
        Err(error) => {
            check_msg(msg.channel_id.say(&ctx.http, error).await);
            return Ok(());
        }
    };

    add_song_to_queue(ctx, msg, &url).await;

    let Some(guild) = msg.guild(&ctx.cache) else {
        check_msg(msg.channel_id.say(&ctx.http, "Not a valid guild".to_owned()).await);
        return Ok(());
    };

    if no_song_playing(ctx).await {
        match play_song(ctx, guild.id, url).await {
            Ok(_) => println!("Playing song"),
            Err(why) => {
                check_msg(
                    msg.channel_id
                        .say(&ctx.http, format!("Error playing song: {:?}", why))
                        .await,
                );
            }
        }
    }

    println!("Finished play function");
    Ok(())
}

////// TESTS ////////
#[cfg(test)]
mod verify_url_tests {
    use crate::play::is_valid_url;

    #[test]
    fn not_starting_with_http_returns_error() {
        assert!(
            is_valid_url(&"Weee".to_string()).is_err(),
            "Weee should reult error"
        );
        assert!(
            is_valid_url(&"pffthttp".to_string()).is_err(),
            "Not startingn with http should restult in error"
        );
        assert!(
            is_valid_url(&"httppfft".to_string()).is_ok(),
            "Staring with http should be valid"
        );
    }
}

#[cfg(test)]
mod test_getting_url {
    use crate::play::get_url;

    use serenity::framework::standard::{Args, Delimiter};

    #[test]
    fn other_than_one_argument_returns_error() {
        let mut args1 = Args::new("booo baa", &[Delimiter::Single(' ')]);
        assert!(
            get_url(&mut args1).is_err(),
            "Should only allow one argument"
        );

        let mut args2 = Args::new("", &[Delimiter::Single(' ')]);
        assert!(
            get_url(&mut args2).is_err(),
            "Should only allow one argument"
        );
    }

    #[test]
    fn valid_url_argument_is_returned() {
        let input_url =
            "https://www.youtube.com/watch?v=4OkSsFsXLD8&ab_channel=NuclearBlastRecords";
        let mut args = Args::new(input_url.clone(), &[Delimiter::Single(' ')]);
        match get_url(&mut args) {
            Ok(url) => assert_eq!(url, input_url),
            Err(_) => assert!(false, "Valid URL should give ok result"),
        }
    }
}
