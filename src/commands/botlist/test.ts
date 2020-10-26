import { BaseCommand, Command } from '../../modules/handler'

@Command('test')
class Test extends BaseCommand {
    constructor(){
        super()
        this.info.visible = false
    }

    execute(){
        this.msg.channel.send(process.memoryUsage().heapUsed /1024 /1024)
    }
}

export default Test