import { faker } from '@faker-js/faker'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { Artist, ArtistProps } from '@/domain/forum/enterprise/entities/artist'
import { PrismaArtistMapper } from '@/infra/database/prisma/mapper/prisma-artist-mapper'

export function makeArtist(
  override: Partial<ArtistProps> = {},
  id?: UniqueEntityID,
) {
  const artist = Artist.create(
    {
      name: faker.person.fullName(),
      username: faker.internet.userName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      ...override,
    },
    id,
  )

  return artist
}

@Injectable()
export class ArtistFactory {
  constructor(private prisma: PrismaService){}

  async makePrismaArtist(data: Partial<ArtistProps> = {}): Promise<Artist>{
    const artist = makeArtist(data)

    await this.prisma.user.create({
      data: PrismaArtistMapper.toPrisma(artist)
    })

    return artist
  }
}
