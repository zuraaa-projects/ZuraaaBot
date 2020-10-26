import { HelpData } from './types'

export function Command(...commandNames: string[]){
    return (target: any) => {
        Reflect.defineMetadata('command:names', commandNames, target)
    }
}

export function HelpInfo(data: HelpData) {
    return (target: any) => {
        Reflect.defineMetadata('command:help', data, target)
    }
}