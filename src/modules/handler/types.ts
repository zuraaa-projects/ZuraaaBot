import { Message } from 'discord.js'

export interface CommandData{
    commandNames: string[]
    cmdClass: any
}

export class HelpData{
    description?: string
    visible?: boolean
    module?: string
    usage?: string[]
}

export abstract class BaseCommand{
    msg!: Message
    args!: string[]

    abstract execute(): void
}