import { Message } from 'discord.js'
import ZuraaaBot from '../../zuraaa-bot'

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
    zuraaa!: ZuraaaBot

    abstract execute(): void
}