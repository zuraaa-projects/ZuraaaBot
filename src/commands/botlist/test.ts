import { Command } from '../../modules/handler'

class Test extends Command {
    name = 'test'

    constructor(){
        super()
        this.info.visible = false
    }

    execute(){
        this.msg.channel.send('oi')
    }
}

export default new Test()