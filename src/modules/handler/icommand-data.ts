import Command from "./command"

interface ICommandData{
    description: string
    visible: boolean,
    module: string,
    usage: string[]
}

export default ICommandData