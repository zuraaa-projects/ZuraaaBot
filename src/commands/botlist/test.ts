import { Command } from '../../modules/handler'

class Test extends Command {
    name = 'test'

    execute(){
        this.msg.channel.send('oi')
    }
}

export default new Test()