import {Command, ICommandData} from '../modules/handler'


class Ping extends Command{
    info: ICommandData = {
        name: 'ping',
        description: '',
        visible: true
    }

    execute(){
        this.msg.channel.send('oi gracinha')
    }
}

export default new Ping()