import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { PrismaService } from "./prisma/prisma.service";
import { CreateAccountController } from "./controllers/create-account.controller";
import { envSchema } from "./env";
import { AuthModule } from "./auth/auth.module";
import { AuthenticateController } from "./controllers/authenticate.controller";
import { CreateEventController } from "./controllers/create-events.controller";
import { FetchRecentEventsController } from "./controllers/fetch-recent-events.controller";
import { DashboardController } from "./controllers/dashboard.controlle";
import { ProfileController } from "./controllers/user-profile.controller";

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: (env) => envSchema.parse(env),
      isGlobal: true,
    }),
    AuthModule,
  ],
  controllers: [
    CreateAccountController,
    AuthenticateController,
    CreateEventController,
    FetchRecentEventsController,
    DashboardController,
    ProfileController
  ],
  providers: [PrismaService],
})
export class AppModule {}
