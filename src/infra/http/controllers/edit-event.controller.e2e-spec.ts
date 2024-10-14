import { AppModule } from "@/infra/app.module";
import { DatabaseModule } from "@/infra/database/database.module";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { AttachmentFactory } from "test/factories/make-attachment";
import { EventFactory } from "test/factories/make-event";
import { EventAttachmentFactory } from "test/factories/make-event-attachment";
import { UserFactory } from "test/factories/make-user";

describe("Edit event (E2E)", () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let userFactory: UserFactory;
  let eventFactory: EventFactory;
  let attachmentFactory: AttachmentFactory;
  let eventAttachmentFactory: EventAttachmentFactory;
  let jwt: JwtService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [
        UserFactory,
        EventFactory,
        AttachmentFactory,
        EventAttachmentFactory,
      ],
    }).compile();

    app = moduleRef.createNestApplication();

    prisma = moduleRef.get(PrismaService);
    userFactory = moduleRef.get(UserFactory);
    eventFactory = moduleRef.get(EventFactory);
    attachmentFactory = moduleRef.get(AttachmentFactory);
    eventAttachmentFactory = moduleRef.get(EventAttachmentFactory);
    jwt = moduleRef.get(JwtService);

    await app.init();
  });

  test("[PUT] /events/:id", async () => {
    const user = await userFactory.makePrismaUser();

    const acessToken = jwt.sign({ sub: user.id.toString() });

    const attachment1 = await attachmentFactory.makePrismaAttachment();
    const attachment2 = await attachmentFactory.makePrismaAttachment();

    const event = await eventFactory.makePrismaEvent({
      authorId: user.id,
    });

    await eventAttachmentFactory.makePrismaEventAttachment({
      attachmentId: attachment1.id,
      eventId: event.id,
    });

    await eventAttachmentFactory.makePrismaEventAttachment({
      attachmentId: attachment2.id,
      eventId: event.id,
    });

    const attachment3 = await attachmentFactory.makePrismaAttachment();

    const eventId = event.id.toString();

    const response = await request(app.getHttpServer())
      .put(`/events/${eventId}`)
      .set("Authorization", `Bearer ${acessToken}`)
      .send({
        title: "New event",
        content: "New content",
        price: 10,
        eventDate: "2024-07-13T19:22:36.123Z",
        eventTime: "2024-07-13T19:22:36.123Z",
        statusPayment: false,
        attachments: [attachment1.id.toString(), attachment3.id.toString()],
      });

    expect(response.statusCode).toBe(204);

    const eventOnDatabase = await prisma.event.findFirst({
      where: {
        title: "New event",
        content: "New content",
      },
    });

    expect(eventOnDatabase).toBeTruthy();

    const attachmentsOnDatabase = await prisma.attachment.findMany({
      where: {
        eventId: eventOnDatabase?.id,
      },
    });

    expect(attachmentsOnDatabase).toHaveLength(2)
    expect(attachmentsOnDatabase).toEqual(expect.arrayContaining([
      expect.objectContaining({
        id: attachment1.id.toString()
      }),
      expect.objectContaining({
        id: attachment3.id.toString()
      })
    ]))
  });
});
