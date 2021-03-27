mod botlist;

use serenity::framework::StandardFramework;
use crate::configs::bot_config::get_prefix;

pub fn create_framework() -> StandardFramework {
    let prefix = get_prefix();
    let framework = StandardFramework::new()
        .configure(|c| c
            .prefix(&prefix[..])
        )
        .group(&botlist::BOTLIST_GROUP);

    framework
}