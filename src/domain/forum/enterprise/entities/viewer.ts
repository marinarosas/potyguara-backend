import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

export interface ViewerProps {
  name: string
  username: string
  email: string
  password: string
}

export class Viewer extends Entity<ViewerProps> {
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

  static create(props: ViewerProps, id?: UniqueEntityID) {
    const viewer = new Viewer(props, id)

    return viewer
  }
}
