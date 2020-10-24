import { Command } from "../../modules/handler";

import axios from 'axios'
import fs from 'fs'

class Download extends Command{
    name = 'download'
    constructor(){
        super()
        this.info.visible = false
    }

    async execute(){
        if(this.msg.author.id != '203713369927057408' && this.msg.author.id != '274289097689006080')
            return

        
        const data = await axios.get(this.args[0], {
            responseType: 'arraybuffer'
        })

        fs.writeFile('uploads/' + this.args[1], Buffer.from(data.data), () => {
            this.msg.channel.send('grande dia, baixado com sucesso....')
        })
    }
}

export default new Download()