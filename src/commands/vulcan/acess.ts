import { BaseCommand, Command, HelpInfo } from "../../modules/handler";
import { exec } from 'child_process'
import { MessageEmbed } from 'discord.js'

@Command('acess', 'exec')
@HelpInfo({
    visible: false
})
class Acess extends BaseCommand{
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
                .setDescription(stout.substring(0, 2000))
            )
        })

    }
    
}

export default Acess