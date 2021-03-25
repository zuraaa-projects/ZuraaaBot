use std::env;
use serenity::{builder::CreateEmbed, client::Context, model::{channel::Message, prelude::User}};

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

pub async fn get_user_from_id_or_mention(msg: &Message, ctx: &Context) -> Option<User> {
    match msg.mentions.first() {
        Some(user) => Some(user.clone()),
        None => {
            let mut msg_splited = msg.content.split(" ").into_iter();
            let _ = msg_splited.next();
            let id = msg_splited.next();

            match id {
                Some(id) => {
                    let formated_id = id.parse::<u64>();

                    match formated_id {
                        Ok(id) => {
                            let user = ctx.http.get_user(id)
                                .await;
                            
                            match user {
                                Ok(user) => Some(user),
                                Err(_) => None
                            }
                        },
                        Err(_) => None
                    }
                },
                None => None
            }
        }
    }
}

pub fn get_id_from_mention_or_content(msg: &Message) -> Option<u64> {
    match msg.mentions.first() {
        Some(user) => Some(user.id.into()),
        None => {
            let mut iter_splited = msg.content.split(" ").into_iter();
            iter_splited.next();
            let string_id = iter_splited.next();

            match string_id {
                Some(id) => {
                    match id.parse::<u64>() {
                        Ok(id) => Some(id),
                        Err(_) => None
                    }
                },
                None => None
            }
        }
    }
}