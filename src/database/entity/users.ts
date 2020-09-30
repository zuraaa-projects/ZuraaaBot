
import { type } from 'os'
import { Column, Entity, ObjectIdColumn, OneToMany } from 'typeorm'
import Bots from './bots'
import UserDetails from './subentitys/user-details'

@Entity({
    name: 'users'
})
class Users {
    @ObjectIdColumn({
        generated: false,
        type: 'string'
    })
    id!: string

    @Column(type => UserDetails)
    details!: UserDetails

}

export default Users