use serenity::framework::StandardFramework;
use crate::helpers::get_prefix;

pub fn create_framework() -> StandardFramework {
    let prefix = get_prefix();
    let framework = StandardFramework::new()
        .configure(|c| c
            .prefix(&prefix[..])
        );

    framework
}