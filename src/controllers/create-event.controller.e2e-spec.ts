import { AppModule } from "@/app.module";
import { PrismaService } from "@/prisma/prisma.service";
import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import  request from "supertest"

describe("Create event (E2E)", () => {
    let app: INestApplication;
    let prisma: PrismaService
    let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();

    prisma = moduleRef.get(PrismaService)

    jwt = moduleRef.get(JwtService)

    await app.init();
  });

  test("[POST] /events", async () => {
    const user = await prisma.user.create({
        data:{
            name: "John Doe",
            username: "johndoe",
            email: 'johndoe2024@example.com',
            password: '123456'
        }
    })

    const acessToken = jwt.sign({sub: user.id})

    const response = await request(app.getHttpServer())
    .post('/events')
    .set('Authorization', `Bearer ${acessToken}`)
    .send({
        title: "New event",
        content: 'Event content',
        price: 10,
        eventDate: "2024-07-13T19:22:36.123Z",
        eventTime: "2024-07-13T19:22:36.123Z",
        statusPayment: false,
    })

    expect(response.statusCode).toBe(201)

    const eventOnDatabase = await prisma.event.findFirst({
        where: {
          title: 'New event'
        }
      })
  
      expect(eventOnDatabase).toBeTruthy()

  });
});
