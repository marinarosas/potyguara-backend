import { AppModule } from "@/infra/app.module";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import  request from "supertest"

describe("Create account (E2E)", () => {
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

  test("[POST] /sing-up", async () => {
    const response = await request(app.getHttpServer()).post('/sing-up').send({
        name: "John Doe",
        username: "johndoe",
        email: 'johndoe2024@example.com',
        password: '123456',
        role: 'VIEWER',
    })

    expect(response.statusCode).toBe(201)

    const userOnDatabase = await prisma.user.findUnique({
        where: {
          email: 'johndoe2024@example.com'
        }
      })
  
      expect(userOnDatabase).toBeTruthy()
  });
});
