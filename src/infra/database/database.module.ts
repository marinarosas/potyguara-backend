import { PrismaService } from "./prisma/prisma.service";
import { PrismaEventsRepository } from "./prisma/repositories/prisma-events-repository";
import { EventsRepository } from "@/domain/forum/application/repositories/events-repository";
import { ViewerRepository } from "@/domain/forum/application/repositories/viewer-repository";
import { PrismaViewersRepository } from "./prisma/repositories/prisma-viewer-repository";
import { PrismaEventAttachemntsRepository } from "./prisma/repositories/prisma-event-attachments-repository";
import { EventAttachmentsRepository } from "@/domain/forum/application/repositories/event-attachments-repository";
import { AttachmentsRepository } from "@/domain/forum/application/repositories/attachments-repository";
import { PrismaAttachmentsRepository } from "./prisma/repositories/prisma-attachments-repository";
import { PrismaNotificationsRepository } from "./prisma/repositories/prisma-notification-repository";
import { NotificationsRepository } from "@/domain/notification/application/repositories/notifications-repository";
import { Module } from "@nestjs/common";
import { CacheModule } from "../cache/cache.module";

@Module({
  imports: [CacheModule],
  providers: [
    PrismaService,
    {
      provide: EventsRepository,
      useClass: PrismaEventsRepository,
    },
    {
      provide: ViewerRepository,
      useClass: PrismaViewersRepository,
    },
    {
      provide: EventAttachmentsRepository,
      useClass: PrismaEventAttachemntsRepository,
    },
    {
      provide: AttachmentsRepository,
      useClass: PrismaAttachmentsRepository,
    },
    {
      provide: NotificationsRepository,
      useClass: PrismaNotificationsRepository,
    },
  ],
  exports: [
    PrismaService,
    EventsRepository,
    ViewerRepository,
    EventAttachmentsRepository,
    AttachmentsRepository,
    NotificationsRepository,
  ],
})
export class DatabaseModule {}
