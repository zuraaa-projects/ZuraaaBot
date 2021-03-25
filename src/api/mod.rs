pub mod get_types;

use std::env;
use reqwest::Client;
use get_types::BotCount;

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
}