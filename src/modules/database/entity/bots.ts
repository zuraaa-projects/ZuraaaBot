import { User } from 'discord.js'
import { type } from 'os'
import { Column, Entity, ManyToOne, ObjectIdColumn } from 'typeorm'
import BotDetails from './subentitys/bot-details'
import BotVotes from './subentitys/bot-votes'
import Users from './users'

@Entity({
    name: 'bots'
})
class Bots{
    @ObjectIdColumn({
        type: 'string',
        generated: false
    })
    _id!: string
    
    @Column()
    username!: string

    @Column()
    discriminator!: string

    @Column()
    owner!: string

    @Column()
    approvedBy!: User

    @Column(type=>BotDetails)
    details!: BotDetails

    @Column(type=>BotVotes)
    votes!: BotVotes
}

export default Bots