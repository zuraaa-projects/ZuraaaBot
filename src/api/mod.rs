pub mod get_types;

use std::env;
use reqwest::Client;
use self::get_types::{BotCount, Bot};

pub struct  ZuraaaApi {
    client: Client,
    base_url: String
}


impl ZuraaaApi {
    pub fn new() -> Self {
        let url = env::var("MARI_API_URL")
            .unwrap_or("https://api.zuraaa.com/".into());
        
        let client = Client::new();
        
        Self {
            client,
            base_url: url
        }
    }

    pub async fn get_bots_count(&self) -> Result<BotCount, reqwest::Error> {
        let result = self.client.get(format!("{}bots?type=count", self.base_url))
            .send()
            .await?;
        let response_body = result.json::<BotCount>()
            .await?;
        
        Ok(response_body)
    }

    pub async fn get_bot(&self, id: u64) -> Result<Bot, reqwest::Error> {
        let result = self.client.get(format!("{}bots/{}", self.base_url, id))
            .send()
            .await?;

        let response_body = result.json::<Bot>()
            .await?;
        
        Ok(response_body)
    }
}