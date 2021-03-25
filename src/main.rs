mod commands;
mod events;
pub mod api;
pub mod helpers;

use std::env;
use serenity::Client;

#[tokio::main]
async fn main() {
    dotenv::dotenv()
        .ok();

    let token = env::var("MARI_BOT_TOKEN")
        .expect("Favor colocar o token do bot na enviroment 'MARI_BOT_TOKEN'");
    
    let mut client = Client::builder(token)
        .framework(commands::create_framework())
        .event_handler(events::Events)
        .await
        .expect("Problema ao criar o client do Serenity");

    client
        .start()
        .await
        .expect("Problemas ao iniciar o bot.");  
}
