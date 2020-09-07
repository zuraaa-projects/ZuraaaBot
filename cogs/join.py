from discord.ext.commands import Cog
from discord import Member, Embed, Color
from datetime import datetime

class Join(Cog):
    def __init__(self, bot):
        self.bot = bot
    
    @Cog.listener()
    async def on_member_join(self, member: Member):
        guilds = self.bot.config["guilds"]
        roles = []
        if member.guild.id == guilds["bottest"] and member.bot:
            roles.append("bottest")
        elif member.guild.id == guilds["main"]:
            if member.bot:
                roles.append("bot")
            else:
                roles.append("member")
                if self.bot.db.bots.find_one({"$or":[{"owner": str(member.id)}, {"details.otherOwners": str(member.id)}]}, {"_id": 1}):
                    roles.append("dev")
            await member.guild.get_channel(self.bot.config["channels"]["welcome"]).send(
                embed=Embed(
                    color=Color.blue(),
                    timestamp=datetime.now(),
                    title="BOT entrou" if member.bot else ""
                ).set_author(name=member.name, icon_url=member.avatar_url)
                .set_thumbnail(url=member.avatar_url)
                .add_field(name="Criação da conta:", value=f"{member.created_at}\n`{(member.joined_at-member.created_at).days}` dias atrás.`")
                .set_footer(text=f"ID: {member.id}")
            )
        roles_c = self.bot.config["roles"]
        await member.add_roles(*[roles_c[role] for role in roles])
    

def setup(bot):
    bot.add_cog(Join(bot))
