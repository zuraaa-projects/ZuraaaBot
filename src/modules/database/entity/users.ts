import { Column, Entity, ObjectIdColumn } from 'typeorm'
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