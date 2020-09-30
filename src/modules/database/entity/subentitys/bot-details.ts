import { type } from 'os'
import { Column } from 'typeorm'

class BotDetails{
    @Column()
    prefix!: string
    @Column()
    library!: string
    @Column()
    tags!: string[]
    @Column()
    shortDescription!: string
    @Column()
    otherOwners!: string[]
    @Column()
    customURL!: string 
}

export default BotDetails