import { DomainEvents } from "@/core/events/domain-events";
import { AppModule } from "@/infra/app.module";
import { DatabaseModule } from "@/infra/database/database.module";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { EventFactory } from "test/factories/make-event";
import { ViewerFactory } from "test/factories/make-viewer";
import { waitFor } from "test/util/wait-for";

describe("On event created (E2E)", () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let viewerFactory: ViewerFactory;
  let eventFactory: EventFactory;
  let jwt: JwtService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [ViewerFactory, EventFactory ],
    }).compile();

    app = moduleRef.createNestApplication();

    prisma = moduleRef.get(PrismaService);
    viewerFactory = moduleRef.get(ViewerFactory);
    eventFactory = moduleRef.get(EventFactory);
    jwt = moduleRef.get(JwtService);

    DomainEvents.shouldRun = true;

    await app.init();
  });

  it("should send a notification when event is created", async () => {
    const user = await viewerFactory.makePrismaViewer();

    const acessToken = jwt.sign({ sub: user.id.toString() });

    await eventFactory.makePrismaEvent({
      authorId: user.id,
    })

  await request(app.getHttpServer())
      .post(`/events`)
      .set("Authorization", `Bearer ${acessToken}`)
      .send({
        title: "New event",
        content: "Event content",
        price: 10,
        eventDate: "2024-07-13T19:22:36.123Z",
        eventTime: "2024-07-13T19:22:36.123Z",
        statusPayment: false,
        attachments: [],
      });

   await waitFor(async () => {
    const notificatioOnDatabase = await prisma.notification.findFirst({
        where: {
            recipientId: user.id.toString(),
        }
    })

    expect(notificatioOnDatabase).not.toBeNull()
   })
  });
});
