import { AppModule } from "@/infra/app.module";
import { DatabaseModule } from "@/infra/database/database.module";
import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { hash } from "bcryptjs";
import  request from "supertest"
import { ViewerFactory } from "test/factories/make-viewer";

describe("Authenticate (E2E)", () => {
    let app: INestApplication;
    let viewerFactory: ViewerFactory;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [ViewerFactory]
    }).compile();

    app = moduleRef.createNestApplication();
    viewerFactory = moduleRef.get(ViewerFactory);

    await app.init();
  });

  test("[POST] /sing-in", async () => {
    await viewerFactory.makePrismaViewer({
            name: "John Doe",
            username: "johndoe",
            email: 'johndoe2024@example.com',
            password: await hash('123456', 8)
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
