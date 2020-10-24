import { Command } from "../../modules/handler";
import { exec } from 'child_process'
import { MessageEmbed } from 'discord.js'

class Acess extends Command{
    name = 'acess'
    constructor(){
        super()
        this.info.visible = false
    }

    async execute(){
        if(this.msg.author.id !== '203713369927057408' && this.msg.author.id !== '274289097689006080')
            return
        exec(this.args.join(' '), {
            timeout: 2000,
            cwd: 'uploads',
        }, (err, stout, sterr) => {
            if(err || sterr)
                return this.msg.channel.send(new MessageEmbed()
                    .setColor('red')
                    .setTitle('deu ruim manin')
                    .setDescription(err || sterr)
                )

            this.msg.channel.send(new MessageEmbed()
                .setColor('#32a852')
                .setTitle('foi')
                .setDescription(stout)
            )
        })

    }
    
}

export default new Acess()