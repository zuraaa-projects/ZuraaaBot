use super::get_types::Bot;

pub fn owners_to_single_vec (bot: &Bot) -> Vec<String> {
    let mut owners = vec![bot.owner.clone()];
    owners = [owners, bot.details.other_owners.clone()].concat();
    owners
}