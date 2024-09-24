import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Artist } from "@/domain/forum/enterprise/entities/artist";
import { User as PrismaUser, Prisma } from "@prisma/client";

export class PrismaArtistMapper {
  static toDomain(raw: PrismaUser): Artist {
    return Artist.create(
      {
        name: raw.name,
        username: raw.username,
        email: raw.email,
        password: raw.password,
      },
      new UniqueEntityID(raw.id)
    );
  }

  static toPrisma(artist: Artist): Prisma.UserUncheckedCreateInput {
    return {
        id: artist.id.toString(),
        name: artist.name,
        username: artist.username,
        email: artist.email,
        password: artist.password,
    };
  }
}
