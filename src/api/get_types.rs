use std::u32;
use serde::Deserialize;

#[derive(Deserialize, Debug)]
pub struct  BotCount {
    pub bots_count: u64
}

#[derive(Deserialize, Debug)]
pub struct Bot {
    #[serde(rename(deserialize = "_id"))]
    pub id: String,
    pub username: String,
    pub discriminator: String,
    pub owner: String,
    pub details: BotDetails,
    pub votes: BotVotes
}

#[derive(Deserialize, Debug)]
#[serde(rename_all = "camelCase")]
pub struct BotDetails {
    pub prefix: String,
    pub tags: Vec<String>,
    pub library: String,
    pub short_description: String,
    pub other_owners: Vec<String>
}

#[derive(Deserialize, Debug)]
pub struct BotVotes {
    pub current: u32
}

#[derive(Deserialize, Debug)]
pub struct User {
    #[serde(rename(deserialize = "_id"))]
    pub id: String,
    pub details: UserDetails
}

#[derive(Deserialize, Debug)]
pub struct UserDetails {
    pub description: String
} 