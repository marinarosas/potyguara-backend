import { Module } from "@nestjs/common";
import { CreateAccountController } from "./controllers/create-account.controller";
import { AuthenticateController } from "./controllers/authenticate.controller";
import { CreateEventController } from "./controllers/create-events.controller";
import { FetchRecentEventsController } from "./controllers/fetch-recent-events.controller";
import { ProfileController } from "./controllers/user-profile.controller";
import { DatabaseModule } from "../database/database.module";
import { CreateEventUseCase } from "@/domain/forum/application/use-cases/create-event";
import { FetchRecentEventsUseCase } from "@/domain/forum/application/use-cases/fetch-recent-events";
import { RegisterViewerUseCase } from "@/domain/forum/application/use-cases/register-viewer";
import { AuthenticateViewerUseCase } from "@/domain/forum/application/use-cases/authenticate.viewer";
import { CryptographyModule } from "../cryptography/cryptography.module";
import { GetEventBySlugController } from "./controllers/get-event-by-slug.controller";
import { GetEventBySlugUseCase } from "@/domain/forum/application/use-cases/get-event-by-slug";
import { EditEventController } from "./controllers/edit-event.controller";
import { EditEventUseCase } from "@/domain/forum/application/use-cases/edit-event";
import { DeleteEventController } from "./controllers/delete-event.controller";
import { DeleteEventUseCase } from "@/domain/forum/application/use-cases/delete-event";
import { UploadAttachmentController } from "./controllers/upload-attachment.controller";
import { StorageModule } from "../storage/storage.module";
import { UploadAndCreateAttachmentUseCase } from "@/domain/forum/application/use-cases/upload-and-create-attachment";

@Module({
  imports: [DatabaseModule, CryptographyModule, StorageModule],
  controllers: [
    CreateAccountController,
    AuthenticateController,
    CreateEventController,
    FetchRecentEventsController,
    ProfileController,
    GetEventBySlugController,
    EditEventController,
    DeleteEventController,
    UploadAttachmentController,
  ],
  providers: [
    CreateEventUseCase,
    FetchRecentEventsUseCase,
    RegisterViewerUseCase,
    AuthenticateViewerUseCase,
    GetEventBySlugUseCase,
    EditEventUseCase,
    DeleteEventUseCase,
    UploadAndCreateAttachmentUseCase,
  ],
})
export class HttpModule {}
