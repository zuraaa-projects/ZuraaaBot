mod botlist;
mod help;

use serenity::{client::Context, framework::{StandardFramework, standard::{CommandResult, macros::hook}}, model::channel::Message};
use crate::configs::bot_config::get_prefix;

pub fn create_framework() -> StandardFramework {
    let prefix = get_prefix();
    let framework = StandardFramework::new()
        .configure(|c| c
            .prefix(&prefix[..])
        )
        .group(&botlist::BOTLIST_GROUP)
        .help(&help::HELP)
        .after(after_hook);

    framework
}

#[hook]
async fn after_hook(_: &Context, _msg: &Message, command_name: &str, command_result: CommandResult) {
    if let Err(why) = command_result {
        println!("Error on command {}: {:?}", command_name, why);
    }
}