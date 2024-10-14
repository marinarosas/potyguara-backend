import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { User } from "@/domain/forum/enterprise/entities/user";
import { User as PrismaUser, Prisma } from "@prisma/client";

export class PrismaUserMapper {
  static toDomain(raw: PrismaUser): User {
    return User.create(
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

  static toPrisma(user: User): Prisma.UserUncheckedCreateInput {
    return {
        id: user.id.toString(),
        name: user.name,
        username: user.username,
        email: user.email,
        password: user.password,
        role: user.role,
    };
  }
}
