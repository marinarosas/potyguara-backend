import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

export interface ArtistProps {
  name: string
  username: string
  email: string
  password: string
}

export class Artist extends Entity<ArtistProps> {
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
  
  static create(props: ArtistProps, id?: UniqueEntityID) {
    const artist = new Artist(props, id)

    return artist
  }
}
