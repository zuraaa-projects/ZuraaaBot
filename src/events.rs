use std::time::Duration;
use serenity::{async_trait, client::{Context, EventHandler}, model::{channel::Message, prelude::{Activity, OnlineStatus, Ready}}};
use crate::api::{ZuraaaApi, get_types::BotCount};
use crate::helpers::{base_embed, get_prefix};

pub struct Events;

#[async_trait]
impl EventHandler for Events {
    async fn ready(&self, ctx: Context, data: Ready) {
        println!("Logado como: {}", data.user.tag());
        let api = ZuraaaApi::new();
        let count = api.get_bots_count()
            .await
            .unwrap_or(BotCount {
                bots_count: 0
            });

        tokio::spawn(async move {    
            loop {
                let frase = format!("a felicidade dos {} bots que estão esperando você! 😊", count.bots_count);
                let activity = OnlineStatus::Online;
                let presence = Activity::listening(&frase);
                ctx.set_presence(Some(presence), activity)
                    .await;

                tokio::time::sleep(Duration::from_secs(180))
                    .await;               
            }
        });
    }

    async fn message(&self, ctx: Context, msg: Message) {
        if msg.author.bot  {
            return;
        }
        
        let current_user = ctx.cache.current_user().await;
        let type01 = format!("<@{}>", &current_user.id);
        let type02 = format!("<@!{}>", &current_user.id);

        if msg.content != type01 && msg.content != type02 {
            return;
        }

        let prefix = get_prefix();
        let final_message = format!("{}help", prefix);
        let message = format!("{}, meu prefixo é `{}`, para ver meus comandos basta usar o comando `{}`!", msg.author.name, prefix, final_message);
        
        let mut embed = base_embed(&ctx).await;
        embed.description(message);
        if let Err(why) = msg.channel_id.send_message(ctx, |m| m
            .set_embed(embed)
        )
            .await
        {
            println!("Ocorreu um erro ao enviar a default message: {:?}", why);
        }
    }
}