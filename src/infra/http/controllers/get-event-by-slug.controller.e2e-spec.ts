import { Slug } from "@/domain/forum/enterprise/entities/value-objects/slug";
import { AppModule } from "@/infra/app.module";
import { DatabaseModule } from "@/infra/database/database.module";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { EventFactory } from "test/factories/make-event";
import { ViewerFactory } from "test/factories/make-viewer";

describe("Get event by slug (E2E)", () => {
  let app: INestApplication;
  let viewerFactory: ViewerFactory;
  let eventFactory: EventFactory;
  let jwt: JwtService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [ViewerFactory, EventFactory],
    }).compile();

    app = moduleRef.createNestApplication();

    viewerFactory = moduleRef.get(ViewerFactory);
    eventFactory = moduleRef.get(EventFactory);
    jwt = moduleRef.get(JwtService);

    await app.init();
  });

  test("[GET] /events/:slug", async () => {
    const user = await viewerFactory.makePrismaViewer();

    const acessToken = jwt.sign({ sub: user.id.toString() });

    await eventFactory.makePrismaEvent({
      authorId: user.id,
      title: "Event 01",
      slug: Slug.create("event-01"),
    });

    const response = await request(app.getHttpServer())
      .get("/events/event-01")
      .set("Authorization", `Bearer ${acessToken}`)
      .send();

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      event: expect.objectContaining({ title: "Event 01" }),
    });
  });
});
