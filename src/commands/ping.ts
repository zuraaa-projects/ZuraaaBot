import { Command, ICommandData } from '../modules/handler'
import { getMongoRepository } from 'typeorm'
import Users from '../database/entity/users'
import Bots from '../database/entity/bots'

class Ping extends Command{
    info: ICommandData = {
        name: 'test',
        description: 'oi',
        visible: true
    }

    execute(){
        const repo = getMongoRepository(Bots)
        repo.find({
            _id: '389917977862078484'
        }).then(user => {
            console.log(user)
            console.log(user[0].details.tags[0])
            this.msg.channel.send(user)
        })
    }
}

export default new Ping()