import { AppModule } from "@/infra/app.module";
import { DatabaseModule } from "@/infra/database/database.module";
import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { EventFactory } from "test/factories/make-event";
import { UserFactory } from "test/factories/make-user";

describe("Fetch recent events (E2E)", () => {
  let app: INestApplication;
  let userFactory: UserFactory;
  let eventFactory: EventFactory;
  let jwt: JwtService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [UserFactory, EventFactory],
    }).compile();

    app = moduleRef.createNestApplication();

    userFactory = moduleRef.get(UserFactory);
    eventFactory = moduleRef.get(EventFactory);
    jwt = moduleRef.get(JwtService);

    await app.init();
  });

  test("[GET] /events", async () => {
    const user = await userFactory.makePrismaUser();

    const acessToken = jwt.sign({ sub: user.id.toString() });

    await Promise.all([
      eventFactory.makePrismaEvent({
        authorId: user.id,
        title: "Event 01",
      }),
      eventFactory.makePrismaEvent({
        authorId: user.id,
        title: "Event 02",
      }),
    ]);

    const response = await request(app.getHttpServer())
      .get("/events")
      .set("Authorization", `Bearer ${acessToken}`)
      .send()

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      events: expect.arrayContaining([
        expect.objectContaining({
          title: "Event 02",
        }),
        expect.objectContaining({
          title: "Event 01",
        }),
      ]),
    });
  });
});
