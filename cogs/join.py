from discord.ext.commands import Cog
from discord import Member, Embed, Color

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
                    timestamp=member.joined_at,
                    title="BOT entrou" if member.bot else ""
                ).set_author(name=member.name, icon_url=member.avatar_url)
                .set_thumbnail(url=member.avatar_url)
                .add_field(name="Criação da conta:", value=f"{member.created_at}\n`{(member.joined_at-member.created_at).days}` dias atrás.`")
                .add_field(name="Posição:", value=f"`#{member.guild.member_count}`")
                .set_footer(text=f"ID: {member.id}")
            )
        roles_c = self.bot.config["roles"]
        await member.add_roles(*[member.guild.get_role(roles_c[role]) for role in roles])
    @Cog.listener()
    async def on_member_remove(self, member: Member):
        if member.guild.id != self.bot.config["guilds"]["main"]:
            return
        if not member.bot:
            if bot := self.bot.db.bots.find_one({"$or":[{"owner": str(member.id)}, {"details.otherOwners": str(member.id)}]}, {"_id": 1}):
                user = False
                for bot in [*(bot["details"].get("otherOwners") or []), bot["owner"]]: 
                    if await member.guild.fetch_member(x):
                        user = True
                        break
                if not user:
                    dbot = await member.guild.fetch_member(bot["_id"])
                    if dbot.bot:
                        await member.guild.kick(bot["_id"], reason="Todos os donos saíram")
        await member.guild.get_channel(self.bot.config["channels"]["welcome"]).send(
            embed=Embed(
                color=Color.blue(),
                timestamp=member.joined_at,
                title="BOT saiu" if member.bot else ""
            ).set_author(name=member.name, icon_url=member.avatar_url)
            .set_thumbnail(url=member.avatar_url)
            .add_field(name="Membros:", value=f"`#{member.guild.member_count}`")
            .set_footer(text=f"ID: {member.id}")
        )
                            
        

def setup(bot):
    bot.add_cog(Join(bot))
