use std::env;
use serenity::framework::StandardFramework;

pub fn create_framework() -> StandardFramework {
    let prefix = env::var("MARI_BOT_PREFIX")
        .unwrap_or("z.".into());
    let framework = StandardFramework::new()
        .configure(|c| c
            .prefix(&prefix[..])
        );

    framework
}