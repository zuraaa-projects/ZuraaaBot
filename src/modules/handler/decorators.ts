export function Command(...commandNames: string[]){
    return (target: any) => {
        Reflect.defineMetadata('command:names', commandNames, target)
    }
}