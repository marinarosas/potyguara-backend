import { AppModule } from "@/infra/app.module";
import { DatabaseModule } from "@/infra/database/database.module";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { NotificationFactory } from "test/factories/make-notification";
import { ViewerFactory } from "test/factories/make-viewer";

describe("Read notification (E2E)", () => {
  let app: INestApplication;
  let viewerFactory: ViewerFactory;
  let notificationFactory: NotificationFactory
  let prisma: PrismaService
  let jwt: JwtService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [
        ViewerFactory,
        NotificationFactory,
      ],
    }).compile();

    app = moduleRef.createNestApplication();

    viewerFactory = moduleRef.get(ViewerFactory);
    notificationFactory = moduleRef.get(NotificationFactory);
    prisma = moduleRef.get(PrismaService);
    jwt = moduleRef.get(JwtService);

    await app.init();
  });

  test("[PATCH] /notifications/:notificationId/read", async () => {
    const user = await viewerFactory.makePrismaViewer({
      name: "John Doe",
    });

    const acessToken = jwt.sign({ sub: user.id.toString() });

    const notification = await notificationFactory.makePrismaNotification({
      recipientId: user.id,
    });

    const notificationId = notification.id.toString()

    const response = await request(app.getHttpServer())
      .patch(`/notifications/${notificationId}/read`)
      .set("Authorization", `Bearer ${acessToken}`)
      .send();

    expect(response.statusCode).toBe(204);

    const notificationOnDatabase = await prisma.notification.findFirst({
        where: {
            recipientId: user.id.toString()
        }
    })

    expect(notificationOnDatabase?.readAt).not.toBeNull()
  });
});
