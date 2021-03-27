use std::env::var;

pub fn get_api_url() -> String {
    var("MARI_API_URL")
        .unwrap_or("https://api.zuraaa.com/".into())
}

pub fn get_site_url() -> String {
    var("MARI_SITE_URL")
        .unwrap_or("https://www.zuraaa.com/".into())
}