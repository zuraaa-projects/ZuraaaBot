import {Message} from 'discord.js'
import ICommandData from './icommand-data'

abstract class Command{
    msg!: Message
    args!: string[]

    abstract info: ICommandData

    abstract execute(): void
}

export default Command