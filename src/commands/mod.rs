mod botlist;
mod utils;

use serenity::{client::Context, framework::{StandardFramework, standard::{CommandGroup, CommandResult, macros::hook}}, model::channel::Message};
use crate::configs::bot_config::get_prefix;

pub fn create_framework() -> StandardFramework {
    let prefix = get_prefix();
    let mut framework = StandardFramework::new()
        .configure(|c| c
            .prefix(&prefix[..])
        )
        .after(after_hook);
    
    for group in  get_groups().iter() {
        framework = framework.group(group);
    }

    framework
}

pub fn get_groups() -> [&'static CommandGroup; 2] {
    [
        &botlist::BOTLIST_GROUP,
        &utils::UTILS_GROUP
    ]
}

#[hook]
async fn after_hook(_: &Context, _msg: &Message, command_name: &str, command_result: CommandResult) {
    if let Err(why) = command_result {
        println!("Error on command {}: {:?}", command_name, why);
    }
}