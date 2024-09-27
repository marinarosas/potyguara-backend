import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Viewer } from "@/domain/forum/enterprise/entities/viewer";
import { User as PrismaUser, Prisma } from "@prisma/client";

export class PrismaViewerMapper {
  static toDomain(raw: PrismaUser): Viewer {
    return Viewer.create(
      {
        name: raw.name,
        username: raw.username,
        email: raw.email,
        password: raw.password,
        role: raw.role,
      },
      new UniqueEntityID(raw.id)
    );
  }

  static toPrisma(viewer: Viewer): Prisma.UserUncheckedCreateInput {
    return {
        id: viewer.id.toString(),
        name: viewer.name,
        username: viewer.username,
        email: viewer.email,
        password: viewer.password,
        role: viewer.role,
    };
  }
}
