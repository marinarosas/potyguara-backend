import { InMemoryViewersRepository } from "test/repositories/in-memory-viewer-repository";
import { FakeHasher } from "test/cryptography/fake-hasher";
import { FakeEncrypter } from "test/cryptography/fake-encrypter";
import { AuthenticateViewerUseCase } from "./authenticate.viewer";
import { makeViewer } from "test/factories/make-viewer";

let inMemoryViewersRepository: InMemoryViewersRepository;
let fakeHasher: FakeHasher;
let fakeEncrypter: FakeEncrypter;

let sut: AuthenticateViewerUseCase;

describe("Authenticate Viewer", () => {
  beforeEach(() => {
    inMemoryViewersRepository = new InMemoryViewersRepository();
    fakeHasher = new FakeHasher();
    fakeEncrypter = new FakeEncrypter();

    sut = new AuthenticateViewerUseCase(
      inMemoryViewersRepository,
      fakeHasher,
      fakeEncrypter
    );
  });

  it("should be able to authenticate a viewer", async () => {
    const viewer = makeViewer({
      email: "johndoe@example.com",
      password: await fakeHasher.hash("123456"),
    });

    inMemoryViewersRepository.items.push(viewer);

    const result = await sut.execute({
      email: "johndoe@example.com",
      password: "123456",
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      viewer: expect.objectContaining({
        email: "johndoe@example.com"
      }),
      accessToken: expect.any(String),
    });
  });
});
