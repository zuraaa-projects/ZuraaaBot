use serenity::{client::Context, framework::standard::{Args, CommandResult, macros::{group, command}}, model::channel::Message};
use crate::{commands::get_groups, configs::bot_config::get_prefix, helpers::{base_embed, result_embed}};

#[group]
#[commands(help)]
pub struct Utils;


#[command]
#[aliases("ajuda", "commands")]
#[example("")]
#[example("{comando}")]
/// Mostra os comandos do bot.
async fn help(
    ctx: &Context,
    msg: &Message,
    mut args: Args,
) -> CommandResult {
    let mut embed = base_embed(msg);
    let groups = get_groups();
    if args.len() == 0 {
        embed
            .title("Comandos do bot:")
            .description(
                format!(
                    "Use `{}help (nome do comando)` para mais informações.",
                    get_prefix()
                )
            );
        
        for group in groups.iter() {
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
    } else {
        let mut command = None;
        let name = args.single::<String>()?;
        'groups: for group in groups.iter() {
            for group_command in group.options.commands {
                if group_command.options.names.contains(&&name[..]) {
                    command = Some(group_command);
                    break 'groups;
                }
            }
        }

        match command {
            Some(command) => {
                embed.description(command.options.desc.unwrap_or("Nenhuma descrição informada."));
                if let Some((name, aliases)) = command.options.names.split_first() {
                    embed.title(name);
                    let examples = command.options.examples;
                    if examples.len() != 0 {
                        let s = if examples.len() == 1 {
                            ""
                        } else {
                            "s"
                        };
                        embed.field(
                            format!("Uso{} do comando:", s),
                            examples
                                .into_iter()
                                .map(|ex| format!(
                                    "`{}{} {}`",
                                    get_prefix(),
                                    name,
                                    ex
                                ))
                                .collect::<Vec<String>>()
                                .join("\n"),
                            false
                        );
                    }
                    if aliases.len() != 0 {
                        embed.field("Aliases:", aliases.join("\n"), false);
                    }
                }
            },
            None => {
                result_embed(&mut embed, false, "Esse comando não foi encontrado.");
            }
        }
    }

    msg.channel_id
        .send_message(ctx, |m| m
            .set_embed(embed)
        ).await?;

    Ok(())
}