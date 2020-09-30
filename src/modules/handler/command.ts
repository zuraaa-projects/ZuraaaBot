import {Message} from 'discord.js'
import ICommandData from './icommand-data'

abstract class Command{
    msg!: Message
    args!: string[]
    abstract name: string
    info: ICommandData = {
        description: '',
        visible: true
    }

    abstract execute(): void
}

export default Command