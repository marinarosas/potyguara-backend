import { PaginationParams } from "@/core/repositories/pagination-params";
import { EventsRepository } from "@/domain/forum/application/repositories/events-repository";
import { Event } from "@/domain/forum/enterprise/entities/event";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { PrismaEventMapper } from "../mapper/prisma-event-mapper";
import { EventAttachmentsRepository } from "@/domain/forum/application/repositories/event-attachments-repository";
import { EventDetails } from "@/domain/forum/enterprise/entities/value-objects/event-details";
import { PrismaEventDetailsMapper } from "../mapper/prisma-event-details-mapper";
import { DomainEvents } from "@/core/events/domain-events";
import { CacheRepository } from "@/infra/cache/cache-repository";

@Injectable()
export class PrismaEventsRepository implements EventsRepository {
  constructor(
    private prisma: PrismaService,
    private cache: CacheRepository,
    private eventAttachmentsRepository: EventAttachmentsRepository
  ) {}

  async findById(id: string): Promise<Event | null> {
    const event = await this.prisma.event.findUnique({
      where: {
        id,
      },
    });

    if (!event) {
      return null;
    }

    return PrismaEventMapper.toDomain(event);
  }

  async findBySlug(slug: string): Promise<Event | null> {
    const event = await this.prisma.event.findUnique({
      where: {
        slug,
      },
    });

    if (!event) {
      return null;
    }

    return PrismaEventMapper.toDomain(event);
  }

  async findDetailsBySlug(slug: string): Promise<EventDetails | null> {
    const cacheHit = await this.cache.get(`event:${slug}:details`);

    if (cacheHit) {
      const cachedData = JSON.parse(cacheHit);

      return PrismaEventDetailsMapper.toDomain(cachedData);
    }

    const event = await this.prisma.event.findUnique({
      where: {
        slug,
      },
      include: {
        author: true,
        attachments: true,
      },
    });

    if (!event) {
      return null;
    }

    await this.cache.set(`event:${slug}:details`, JSON.stringify(event));

    const eventDetails = PrismaEventDetailsMapper.toDomain(event);

    return eventDetails;
  }

  async findManyRecent({ page }: PaginationParams): Promise<Event[]> {
    const events = await this.prisma.event.findMany({
      orderBy: {
        createdAt: "desc",
      },
      take: 20,
      skip: (page - 1) * 20,
    });

    return events.map(PrismaEventMapper.toDomain);
  }

  async findManyByAuthorId(
    authorId: string,
    { page }: PaginationParams
  ): Promise<Event[]> {
  
    const events = await this.prisma.event.findMany({
      where:{
        authorId,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 20,
      skip: (page - 1) * 20,
    });

    return events.map(PrismaEventMapper.toDomain);
  }

  async create(event: Event): Promise<void> {
    const data = PrismaEventMapper.toPrisma(event);

    await this.prisma.event.create({
      data,
    });

    await this.eventAttachmentsRepository.createMany(
      event.attachments.getItems()
    );

    DomainEvents.dispatchEventsForAggregate(event.id);
  }

  async save(event: Event): Promise<void> {
    const data = PrismaEventMapper.toPrisma(event);

    await Promise.all([
      this.prisma.event.update({
        where: {
          id: event.id.toString(),
        },
        data,
      }),
      this.eventAttachmentsRepository.createMany(
        event.attachments.getNewItems()
      ),
      this.eventAttachmentsRepository.deleteMany(
        event.attachments.getRemovedItems()
      ),
      this.cache.delete(`event:${data.slug}:details`),
    ]);

    DomainEvents.dispatchEventsForAggregate(event.id);
  }

  async delete(event: Event): Promise<void> {
    const data = PrismaEventMapper.toPrisma(event);

    await this.prisma.event.delete({
      where: {
        id: data.id,
      },
    });
  }
}
