from discord.ext.commands import Bot
from pymongo import MongoClient
from json import load

config = load(open("config.json"))

bot = Bot(config.prefixes, None)

COGS = ["join"]
for cog in COGS:
    bot.load_extension(f'cogs.{cog}')

bot.db = MongoClient(config["mongo"]["uri"])[config["mongo"]["db"]]
bot.config = config

bot.run(config["token"])