import { AppModule } from "@/infra/app.module";
import { DatabaseModule } from "@/infra/database/database.module";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { AttachmentFactory } from "test/factories/make-attachment";
import { UserFactory } from "test/factories/make-user";

describe("Create event (E2E)", () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let userFactory: UserFactory;
  let attachmentFactory: AttachmentFactory;
  let jwt: JwtService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [UserFactory, AttachmentFactory],
    }).compile();

    app = moduleRef.createNestApplication();

    prisma = moduleRef.get(PrismaService);
    userFactory = moduleRef.get(UserFactory);
    attachmentFactory = moduleRef.get(AttachmentFactory);
    jwt = moduleRef.get(JwtService);

    await app.init();
  });

  test("[POST] /events", async () => {
    const user = await userFactory.makePrismaUser();

    const acessToken = jwt.sign({ sub: user.id.toString() });

    const attachment1 = await attachmentFactory.makePrismaAttachment();
    const attachment2 = await attachmentFactory.makePrismaAttachment();

    const response = await request(app.getHttpServer())
      .post("/events")
      .set("Authorization", `Bearer ${acessToken}`)
      .send({
        title: "New event",
        content: "Event content",
        price: 10,
        eventDate: "2024-07-13T19:22:36.123Z",
        eventTime: "2024-07-13T19:22:36.123Z",
        statusPayment: false,
        attachments: [attachment1.id.toString(), attachment2.id.toString()],
      });

    expect(response.statusCode).toBe(201);

    const eventOnDatabase = await prisma.event.findFirst({
      where: {
        title: "New event",
      },
    });

    expect(eventOnDatabase).toBeTruthy();

    const attachmentsOnDatabase =  await prisma.attachment.findMany({
      where: {
        eventId: eventOnDatabase?.id
      }
    })

    expect(attachmentsOnDatabase).toHaveLength(2)
  });
});
