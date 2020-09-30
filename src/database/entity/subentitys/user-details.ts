import { Column } from 'typeorm'

class UserDetails{
    @Column()
    description!: string
}

export default UserDetails