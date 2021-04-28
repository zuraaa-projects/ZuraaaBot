use serenity::{client::Context, framework::standard::{CommandResult, macros::{command, group}}, model::channel::Message};
use crate::api::{ZuraaaApi, api_formats::{owners_to_single_vec, format_tags}};
use crate::helpers::{get_id_from_mention_or_content, base_embed, get_avatar_url, get_users_from_vec};
use crate::configs::api_config;

#[group]
#[commands(bot, userinfo)]
pub struct BotList;

#[command]
async fn bot(ctx: &Context, msg: &Message) -> CommandResult {
    let id_user = get_id_from_mention_or_content(msg);

    match id_user {
        Some(id) => {
            let api = ZuraaaApi::new();
            let bot = api.get_bot(id)
                .await;
            match bot {
                Ok(bot_data) => {
                    let mut embed = base_embed(msg);

                    let user = ctx.http.get_user(id)
                        .await?;
                    
                    embed.title(user.tag());
                    embed.url(format!("{}bots/{}", api_config::get_site_url(), &id));
                    embed.description(&bot_data.details.short_description);
                    embed.thumbnail(get_avatar_url(&user));

                    let owners = owners_to_single_vec(&bot_data);
                    let owners_tags_in_tags = get_users_from_vec(owners, ctx)
                        .await?;
                    let owners_formated = owners_tags_in_tags
                        .iter()
                        .fold(String::new(), |act, new| {
                            format!("{}\n[`{}`]({}user/{})", act, new.tag(), api_config::get_site_url(), new.id.0)
                        });
                    embed.field("Dono(s):", owners_formated, true);
                    
                    embed.field("Votos:", &bot_data.votes.current, true);
                    embed.field("Prefixo:", format!("`{}`", &bot_data.details.prefix), true);
                    embed.field("Biblioteca:", &bot_data.details.library, true);
                    
                    let tags = format_tags(&bot_data.details.tags);
                    let tags_in_string = tags
                        .iter()
                        .fold(String::new(), |act, new| {
                            format!("{}\n{}", act, new)
                        });
                    embed.field("Tags:", tags_in_string, true);

                    let links = format!("[Votar]({link}bots/{id}/votar)\n[Adicionar]({link}bots/{id}/add)", link=api_config::get_site_url(), id=&id);
                    embed.field("Links:", links, true);

                    msg.channel_id.send_message(ctx, |m| m
                        .set_embed(embed)
                        .reference_message(msg)
                    )
                        .await?;
                },
                Err(_) => {
                    //Erro msg bot not found
                }
            }

        },
        None => {
            //Erro msg id not formated
        }
    }
    Ok(())
}

#[command]
async fn userinfo(ctx: &Context, msg: &Message) -> CommandResult {
    let id_user = get_id_from_mention_or_content(msg);
    match id_user {
        Some(id) => {
            let api = ZuraaaApi::new();
            let user_api_data = api.get_user(id)
                .await;
            
            match user_api_data {
                Ok(user_data) => {
                    let mut embed = base_embed(msg);
                    
                    let discord_user = ctx.http.get_user(id)
                    .await?;
                    
                    embed.title(&discord_user.tag());
                    embed.description(&user_data.details.description);
                    embed.url(format!("{}user/{}", api_config::get_site_url(), &id));
                    
                    let bots = api.get_user_bots(&user_data)
                        .await?;
                    
                    let bots_formated = bots
                        .iter()
                        .fold(String::new(), |act, new| {
                            format!("{}\n[{}#{}]({}bots/{})", act, new.username, new.discriminator, api_config::get_site_url(), new.id)
                        });
                    embed.field("Bots desenvolvidos:", bots_formated, true);
                    let avatar = get_avatar_url(&discord_user);
                    embed.thumbnail(avatar);

                    msg.channel_id.send_message(ctx, |m| m
                        .set_embed(embed)
                        .reference_message(msg)
                    )
                        .await?;
                },
                Err(why) => {
                    println!("Morri aki: {:?}", why)
                    //Erro user not found
                }
            }
        },
        None => {
            println!("Id morto");
            //Erro msg id not formated
        }
    }

    Ok(())
}