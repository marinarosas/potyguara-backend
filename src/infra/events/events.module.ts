import { OnEventCreated } from "@/domain/notification/application/subscribers/on-event-created";
import { SendNotificationUseCase } from "@/domain/notification/application/use-cases/send-notification";
import { Module } from "@nestjs/common";
import { DatabaseModule } from "../database/database.module";

@Module({
    imports:[DatabaseModule],
    providers: [
        OnEventCreated,
        SendNotificationUseCase,
    ],
})
export class  EventsModule {}