import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

interface ArtistProps {
  name: string
  username: string
}

export class Artist extends Entity<ArtistProps> {
  static create(props: ArtistProps, id?: UniqueEntityID) {
    const artist = new Artist(props, id)

    return artist
  }
}
