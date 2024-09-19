import { AppModule } from "@/infra/app.module";
import { DatabaseModule } from "@/infra/database/database.module";
import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { ViewerFactory } from "test/factories/make-viewer";

describe("Upload attachment (E2E)", () => {
  let app: INestApplication;
  let viewerFactory: ViewerFactory;
  let jwt: JwtService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [ViewerFactory],
    }).compile();

    app = moduleRef.createNestApplication();

    viewerFactory = moduleRef.get(ViewerFactory);
    jwt = moduleRef.get(JwtService);

    await app.init();
  });

  test("[POST] /attachments", async () => {
    const user = await viewerFactory.makePrismaViewer();

    const acessToken = jwt.sign({ sub: user.id.toString() });

    const response = await request(app.getHttpServer())
      .post("/attachments")
      .set("Authorization", `Bearer ${acessToken}`)
      .attach('file', './test/e2e/sample-upload.png');

    expect(response.statusCode).toBe(201);
    expect(response.body).toEqual({
      attachmentId: expect.any(String),
    });
  });
});
