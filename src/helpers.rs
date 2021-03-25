use std::env;
use serenity::{builder::CreateEmbed, client::Context};

pub async fn base_embed(ctx: &Context) -> CreateEmbed {
    let mut embed = CreateEmbed::default();
    let current_user = ctx.cache.current_user().await;
    let avatar = current_user
        .avatar_url()
        .unwrap_or(current_user.default_avatar_url());

    embed.color(16777088);
    embed.footer(|f| f
        .icon_url(avatar)
        .text(current_user.tag())
    );

    embed
}

pub fn get_prefix() -> String {
    let prefix = env::var("MARI_BOT_PREFIX")
        .unwrap_or("z.".into());

    prefix
}