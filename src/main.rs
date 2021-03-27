mod commands;
mod events;
pub mod api;
pub mod helpers;
pub mod configs;

use serenity::Client;
use configs::bot_config;

#[allow(dead_code)]
type UniversalError = Box<dyn std::error::Error>;

#[tokio::main]
async fn main() {
    dotenv::dotenv()
        .ok();

    let token = bot_config::get_token();
    
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
