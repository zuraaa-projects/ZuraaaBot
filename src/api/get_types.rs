use std::u32;
use serde::Deserialize;

#[derive(Deserialize)]
pub struct  BotCount {
    pub bots_count: u64
}

#[derive(Deserialize)]
pub struct Bot {
    #[serde(rename(deserialize = "_id"))]
    pub id: String,
    pub owner: String,
    pub details: BotDetails,
    pub votes: BotVotes
}

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct BotDetails {
    pub prefix: String,
    pub tags: Vec<String>,
    pub library: String,
    pub short_description: String,
    pub other_owners: Vec<String>
}

#[derive(Deserialize)]
pub struct BotVotes {
    pub current: u32
}