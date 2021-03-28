pub mod get_types;
pub mod api_formats;

use reqwest::Client;
use self::get_types::{BotCount, Bot, User};
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

    pub async fn get_user(&self, id: u64) -> Result<User, reqwest::Error> {
        let result = self.client.get(format!("{}users/{}", self.base_url, id))
            .send()
            .await?;
        let response_body = result.json::<User>()
            .await?;
        
        Ok(response_body)
    }

    pub async fn get_user_bots(&self, user: &User) -> Result<Vec<Bot>, reqwest::Error> {
        let result = self.client.get(format!("{}users/{}/bots", self.base_url, user.id))
            .send()
            .await?;
        let response_body = result.json::<Vec<Bot>>()
            .await?;
        Ok(response_body)
    }
}