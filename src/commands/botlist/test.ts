import { BaseCommand, Command, HelpInfo } from '../../modules/handler'

@Command('test')
@HelpInfo({
    visible: false
})
class Test extends BaseCommand {
    
    execute(){
        this.msg.channel.send(process.memoryUsage().heapUsed /1024 /1024)
    }
}

export default Test