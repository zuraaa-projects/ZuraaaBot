import { Message } from 'discord.js'

export interface CommandData{
    commandNames: string[]
    cmdClass: any
}

export interface ICommandData{
    description: string
    visible: boolean,
    module: string,
    usage: string[]
}

export abstract class BaseCommand{
    msg!: Message
    args!: string[]
    info: ICommandData = {
        description: 'Sem descrição informada.',
        visible: true,
        module: 'Default',
        usage: ['']
    }

    abstract execute(): void
}
