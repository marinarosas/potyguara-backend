import { faker } from '@faker-js/faker'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  Event,
  EventProps,
} from '@/domain/forum/enterprise/entities/event'
import { Viewer, ViewerProps } from '@/domain/forum/enterprise/entities/viewer'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { PrismaViewerMapper } from '@/infra/database/prisma/mapper/prisma-viewer-mapper'

export function makeViewer(
  override: Partial<ViewerProps> = {},
  id?: UniqueEntityID,
) {
  const viewer = Viewer.create(
    {
      name: faker.person.fullName(),
      username: faker.internet.userName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      ...override,
    },
    id,
  )

  return viewer
}

@Injectable()
export class ViewerFactory {
  constructor(private prisma: PrismaService){}

  async makePrismaViewer(data: Partial<ViewerProps> = {}): Promise<Viewer>{
    const viewer = makeViewer(data)

    await this.prisma.user.create({
      data: PrismaViewerMapper.toPrisma(viewer)
    })

    return viewer
  }
}
