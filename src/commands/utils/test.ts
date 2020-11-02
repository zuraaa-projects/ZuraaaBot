import { BaseCommand, Command, HelpInfo } from '../../modules/handler'
import ZuraaaApi from '../../modules/api/zuraaaapi'

@Command('test')
@HelpInfo({
    visible: false
})
class Test extends BaseCommand {
    
    async execute(){
        const api = new ZuraaaApi()

        console.log(await api.getBot('0'))
    }
}

export default Test