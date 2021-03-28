use super::get_types::Bot;

pub fn owners_to_single_vec (bot: &Bot) -> Vec<String> {
    let mut owners = vec![bot.owner.clone()];
    owners = [owners, bot.details.other_owners.clone()].concat();
    owners
}

pub fn format_tags(tags: &Vec<String>) -> Vec<String> {
    let mut return_vec = Vec::new();
    for tag in tags.iter() {
        let tag_matched = match &tag[..] {
            "anime" => "Anime",
            "dashboard" => "Dashboard",
            "diversao" => "Diversão",
            "utilidades" => "Utilidades",
            "social" => "Social",
            "jogos" => "Jogos",
            "musica" => "Música",
            "moderacao" => "Moderação",
            "economia" => "Economia",
            "fornite" => "Fortnite",
            "lol" => "League of Legends",
            "minecraft" => "Minecraft",
            "hytale" => "Hytale",
            "nsfw" => "NSFW",
            "outros" => "Outros",
            _ => ""
        };
        return_vec.push(tag_matched.into());
    }

    return_vec
}