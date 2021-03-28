use serenity::{builder::CreateEmbed, client::Context, model::{channel::Message, prelude::User}};

pub fn get_avatar_url(user: &User) -> String {
    let avatar = user
        .avatar_url()
        .unwrap_or(user.default_avatar_url());
    avatar
}

pub fn base_embed(msg: &Message) -> CreateEmbed {
    let mut embed = CreateEmbed::default();
    let author = &msg.author;
    let avatar = get_avatar_url(&author);
    embed.color(16777088);
    embed.footer(|f| f
        .icon_url(avatar)
        .text(author.tag())
    );

    embed
}

pub async fn get_user_from_id_or_mention(msg: &Message, ctx: &Context) -> Option<User> {
    match msg.mentions.first() {
        Some(user) => Some(user.clone()),
        None => {
            let mut msg_splited = msg.content.split(" ").into_iter();
            let _ = msg_splited.next();
            let id = msg_splited.next();

            match id {
                Some(id) => {
                    let formated_id = id.parse::<u64>();

                    match formated_id {
                        Ok(id) => {
                            let user = ctx.http.get_user(id)
                                .await;
                            
                            match user {
                                Ok(user) => Some(user),
                                Err(_) => None
                            }
                        },
                        Err(_) => None
                    }
                },
                None => None
            }
        }
    }
}

pub fn get_id_from_mention_or_content(msg: &Message) -> Option<u64> {
    match msg.mentions.first() {
        Some(user) => Some(user.id.into()),
        None => {
            let mut iter_splited = msg.content.split(" ").into_iter();
            iter_splited.next();
            let string_id = iter_splited.next();

            match string_id {
                Some(id) => {
                    match id.parse::<u64>() {
                        Ok(id) => Some(id),
                        Err(_) => None
                    }
                },
                None => None
            }
        }
    }
}

pub async fn get_users_tags_from_vec(users: Vec<String>, ctx: &Context) -> Result<Vec<String>, serenity::Error> {
    let mut vec_result = Vec::new();

    for user_id in users.iter() {
        let id_in_u64 = user_id.parse::<u64>()?;

        let fetched_user = ctx.http.get_user(id_in_u64)
            .await?;
        
        vec_result.push(fetched_user.tag());
    }

    Ok(vec_result)
}

