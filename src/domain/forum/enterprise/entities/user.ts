import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Role } from '@prisma/client'


export interface UserProps {
  name: string
  username: string
  email: string
  password: string
  role: Role
}

export class User extends Entity<UserProps> {
  get name(){
    return this.props.name
  }

  get username(){
    return this.props.username
  }

  get email(){
    return this.props.email
  }

  get password(){
    return this.props.password
  }

  get role(){
    return this.props.role
  }

  static create(props: UserProps, id?: UniqueEntityID) {
    const user = new User(props, id)

    return user
  }
}
