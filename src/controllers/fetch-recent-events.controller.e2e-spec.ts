import { AppModule } from "@/app.module";
import { PrismaService } from "@/prisma/prisma.service";
import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import request from "supertest";

describe("Fetch recent events (E2E)", () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let jwt: JwtService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();

    prisma = moduleRef.get(PrismaService);

    jwt = moduleRef.get(JwtService);

    await app.init();
  });

  test("[GET] /events", async () => {
    const user = await prisma.user.create({
      data: {
        name: "John Doe",
        username: "johndoe",
        email: "johndoe2024@example.com",
        password: "123456",
      },
    });

    const acessToken = jwt.sign({ sub: user.id });

    await prisma.event.createMany({
      data: [
        {
          title: "Event 01",
          content: "Event content",
          price: 10, 
          eventDate: "2024-07-13T19:22:36.123Z",
          eventTime: "2024-07-13T19:22:36.123Z",
          statusPayment: false,
          authorId: user.id,
          slug: "event-01"
        },
        {
            title: "Event 02",
            content: "Event content",
            price: 10, 
            eventDate: "2024-07-13T19:22:36.123Z",
            eventTime: "2024-07-13T19:22:36.123Z",
            statusPayment: false,
            authorId: user.id,
            slug: "event-02"
          }
      ],
    });

    const response = await request(app.getHttpServer())
      .get("/events")
      .set("Authorization", `Bearer ${acessToken}`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      events: [
        expect.objectContaining({
          title: "Event 01",
        }),
        expect.objectContaining({
          title: "Event 02",
        }),
      ],
    });
  });
});
