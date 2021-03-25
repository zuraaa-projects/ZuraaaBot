use serenity::{client::Context, framework::standard::{CommandResult, macros::{command, group}}, model::channel::Message};
use crate::api::ZuraaaApi;
use crate::helpers::{get_id_from_mention_or_content, base_embed};

#[group]
#[commands(bot)]
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
                    let mut embed = base_embed(ctx)
                        .await;

                    let user = ctx.http.get_user(id)
                        .await?;
                    
                    embed.title(user.tag());

                    msg.channel_id.send_message(ctx, |m| m
                        .set_embed(embed)
                        .reference_message(msg)    
                    )
                        .await?;
                },
                Err(why) => println!("{:?}", why)
            }

        },
        None => println!("None")
    }
    Ok(())
}