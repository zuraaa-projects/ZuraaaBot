pub mod get_types;
pub mod api_formats;

use reqwest::Client;
use self::get_types::{BotCount, Bot};
use crate::configs::api_config;

pub struct  ZuraaaApi {
    client: Client,
    base_url: String
}


impl ZuraaaApi {
    pub fn new() -> Self {
        let url = api_config::get_api_url();
        
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