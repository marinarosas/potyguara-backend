import { PrismaService } from "./prisma/prisma.service";
import { PrismaEventsRepository } from "./prisma/repositories/prisma-events-repository";
import { EventsRepository } from "@/domain/forum/application/repositories/events-repository";
import { UserRepository } from "@/domain/forum/application/repositories/user-repository";
import { PrismaUsersRepository } from "./prisma/repositories/prisma-user-repository";
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
      provide: UserRepository,
      useClass: PrismaUsersRepository,
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
    UserRepository,
    EventAttachmentsRepository,
    AttachmentsRepository,
    NotificationsRepository,
  ],
})
export class DatabaseModule {}
