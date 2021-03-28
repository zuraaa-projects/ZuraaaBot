mod botlist;

use serenity::{client::Context, framework::{StandardFramework, standard::{DispatchError, macros::hook}}, model::channel::Message};
use crate::configs::bot_config::get_prefix;

pub fn create_framework() -> StandardFramework {
    let prefix = get_prefix();
    let framework = StandardFramework::new()
        .configure(|c| c
            .prefix(&prefix[..])
        )
        .group(&botlist::BOTLIST_GROUP)
        .on_dispatch_error(dispatch_error_hook);

    framework
}

#[hook]
async fn dispatch_error_hook(_: &Context, _msg: &Message, err: DispatchError) {
    println!("{:?}", &err);
}