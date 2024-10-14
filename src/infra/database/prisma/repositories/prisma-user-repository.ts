import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { User } from "@/domain/forum/enterprise/entities/user";
import { PrismaUserMapper } from "../mapper/prisma-user-mapper";
import { UserRepository } from "@/domain/forum/application/repositories/user-repository";

@Injectable()
export class PrismaUsersRepository implements UserRepository {
  constructor(private prisma: PrismaService) {}
    

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return null;
    }

    return PrismaUserMapper.toDomain(user);
  }

  async findByUsername(username: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
        where: {
            username,
        },
      });
  
      if (!user) {
        return null;
      }
  
      return PrismaUserMapper.toDomain(user);
}

  async create(user: User): Promise<void> {
    const data = PrismaUserMapper.toPrisma(user);
    await this.prisma.user.create({
      data,
    });
  }
}
