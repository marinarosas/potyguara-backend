import { AppModule } from "@/infra/app.module";
import { DatabaseModule } from "@/infra/database/database.module";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { EventFactory } from "test/factories/make-event";
import { ViewerFactory } from "test/factories/make-viewer";

describe("Delete event (E2E)", () => {
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

  test("[DELETE] /events/:id", async () => {
    const user = await viewerFactory.makePrismaViewer();

    const acessToken = jwt.sign({ sub: user.id.toString() });

    const event = await eventFactory.makePrismaEvent({
      authorId: user.id,
    });

    const eventId = event.id.toString();

    const response = await request(app.getHttpServer())
      .delete(`/events/${eventId}`)
      .set("Authorization", `Bearer ${acessToken}`)
      .send();

    expect(response.statusCode).toBe(204);

    const eventOnDatabase = await prisma.event.findUnique({
      where: {
       id: eventId,
      },
    });

    expect(eventOnDatabase).toBeNull();
  });
});
