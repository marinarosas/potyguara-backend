import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { EventDetails } from "@/domain/forum/enterprise/entities/value-objects/event-details";
import { Slug } from "@/domain/forum/enterprise/entities/value-objects/slug";
import {
  Event as PrismaEvent,
  User as PrismaUser,
  Attachment as PrismaAttachment,
} from "@prisma/client";
import { PrismaAttachmentMapper } from "./prisma-attachment-mapper";

type PrismaEventDetails = PrismaEvent & {
  author: PrismaUser;
  attachments: PrismaAttachment[];
};

export class PrismaEventDetailsMapper {
  static toDomain(raw: PrismaEventDetails): EventDetails {
    return EventDetails.create({
      eventId: new UniqueEntityID(raw.id),
      authorId: new UniqueEntityID(raw.authorId),
      author: raw.author.name,
      title: raw.title,
      content: raw.content,
      slug: Slug.create(raw.slug),
      price: raw.price,
      eventDate: raw.eventDate,
      eventTime: raw.eventTime,
      statusPayment: raw.statusPayment,
      attachments: raw.attachments.map(PrismaAttachmentMapper.toDomain),
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    });
  }
}
