import { AppModule } from "@/app.module";
import { PrismaService } from "@/prisma/prisma.service";
import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { hash } from "bcryptjs";
import  request from "supertest"

describe("Authenticate (E2E)", () => {
    let app: INestApplication;
    let prisma: PrismaService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();

    prisma = moduleRef.get(PrismaService)

    await app.init();
  });

  test("[POST] /sing-in", async () => {
    await prisma.user.create({
        data:{
            name: "John Doe",
            username: "johndoe",
            email: 'johndoe2024@example.com',
            password: await hash('123456', 8)
        }
    })
    const response = await request(app.getHttpServer()).post('/sing-in').send({
        email: 'johndoe2024@example.com',
        password: '123456'
    })

    expect(response.statusCode).toBe(201)
    expect(response.body).toEqual({
        user: expect.objectContaining({
            name: "John Doe"
        }),
        token: expect.any(String)
    })
  });
});
