use std::time::Duration;
use serenity::{async_trait, client::{Context, EventHandler}, model::prelude::{Activity, OnlineStatus, Ready}};
use crate::api::{ZuraaaApi, get_types::BotCount};

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
}