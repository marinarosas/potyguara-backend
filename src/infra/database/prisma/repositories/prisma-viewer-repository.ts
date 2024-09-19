import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { ViewerRepository } from "@/domain/forum/application/repositories/viewer-repository";
import { Viewer } from "@/domain/forum/enterprise/entities/viewer";
import { PrismaViewerMapper } from "../mapper/prisma-viewer-mapper";

@Injectable()
export class PrismaViewersRepository implements ViewerRepository {
  constructor(private prisma: PrismaService) {}
    

  async findByEmail(email: string): Promise<Viewer | null> {
    const viewer = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!viewer) {
      return null;
    }

    return PrismaViewerMapper.toDomain(viewer);
  }

  async findByUsername(username: string): Promise<Viewer | null> {
    const viewer = await this.prisma.user.findUnique({
        where: {
            username,
        },
      });
  
      if (!viewer) {
        return null;
      }
  
      return PrismaViewerMapper.toDomain(viewer);
}

  async create(viewer: Viewer): Promise<void> {
    const data = PrismaViewerMapper.toPrisma(viewer);
    await this.prisma.user.create({
      data,
    });
  }
}
