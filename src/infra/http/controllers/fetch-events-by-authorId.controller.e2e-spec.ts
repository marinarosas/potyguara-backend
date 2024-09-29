import { AppModule } from "@/infra/app.module";
import { DatabaseModule } from "@/infra/database/database.module";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { EventFactory } from "test/factories/make-event";
import { ViewerFactory } from "test/factories/make-viewer";

describe("Fetch events by Author Id (E2E)", () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let viewerFactory: ViewerFactory;
  let eventFactory: EventFactory;
  let jwt: JwtService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [ViewerFactory, EventFactory],
    }).compile();

    app = moduleRef.createNestApplication();

    prisma = moduleRef.get(PrismaService);
    viewerFactory = moduleRef.get(ViewerFactory);
    eventFactory = moduleRef.get(EventFactory);
    jwt = moduleRef.get(JwtService);

    await app.init();
  });

  test("[GET] /events/me", async () => {
    const user = await viewerFactory.makePrismaViewer();

    const acessToken = jwt.sign({ sub: user.id.toString() });

    const events = await Promise.all([
      eventFactory.makePrismaEvent({
        authorId: user.id,
      }),
      eventFactory.makePrismaEvent({
        authorId: user.id,
      }),
    ]);

    const eventAuthorId = events[0].authorId.toString();

    const response = await request(app.getHttpServer())
      .get("/events/me")
      .set("Authorization", `Bearer ${acessToken}`)
      .send();

    expect(response.statusCode).toBe(200);

    const eventOnDatabase = await prisma.event.findMany({
      where: {
        authorId: eventAuthorId,
      },
    });

    expect(eventOnDatabase).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          authorId: eventAuthorId,
        }),
        expect.objectContaining({
          authorId: eventAuthorId,
        }),
      ])
    );
  });
});
