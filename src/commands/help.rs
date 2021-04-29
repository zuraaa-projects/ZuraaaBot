use serenity::{client::Context, framework::standard::{Args, CommandGroup, CommandResult, HelpOptions, macros::help}, model::channel::Message};

use crate::{configs::bot_config::get_prefix, helpers::base_embed};

#[help]
async fn help(
    ctx: &Context,
    msg: &Message,
    mut args: Args,
    _help_options: &'static HelpOptions,
    groups: &[&'static CommandGroup]
) -> CommandResult {
    let mut embed = base_embed(msg);

    if args.len() == 0 {
        embed
            .title("Comandos do bot:")
            .description(
                format!(
                    "Use `{}help (nome do comando)` para mais informações.",
                    get_prefix()
                )
            );
        
        for group in groups {
            if group.options.help_available {
                embed.field(
                    group.name,
                    format!(
                        "`{}`",
                        group.options.commands
                            .iter()
                            .filter(|x| x.options.help_available)
                            .map(|x| x.options.names[0].into())
                            .collect::<Vec<String>>()
                            .join("` `")
                    ),
                    false
                );
            }
        }
        
        msg.channel_id
            .send_message(ctx, |m| m
                .set_embed(embed)
            ).await?;
    }

    Ok(())
}