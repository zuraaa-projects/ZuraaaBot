use std::env::var;

pub fn get_token() -> String {
    var("MARI_BOT_TOKEN")
        .expect("Favor colocar o token do bot na enviroment 'MARI_BOT_TOKEN'")
}

pub fn get_prefix() -> String {
    var("MARI_BOT_PREFIX")
        .unwrap_or("z.".into())
}