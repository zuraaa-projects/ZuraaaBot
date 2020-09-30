import { Column } from 'typeorm'

class BotVotes{
    @Column()
    current!: number
}

export default BotVotes