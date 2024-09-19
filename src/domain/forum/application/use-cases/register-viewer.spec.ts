import { InMemoryViewersRepository } from "test/repositories/in-memory-viewer-repository";
import { RegisterViewerUseCase } from "./register-viewer";
import { FakeHasher } from "test/cryptography/fake-hasher";

let inMemoryViewersRepository: InMemoryViewersRepository;
let fakeHasher: FakeHasher;

let sut: RegisterViewerUseCase;

describe("Register Viewer", () => {
  beforeEach(() => {
    inMemoryViewersRepository = new InMemoryViewersRepository();
    fakeHasher = new FakeHasher();
    sut = new RegisterViewerUseCase(inMemoryViewersRepository, fakeHasher);
  });

  it("should be able to register a new viewer", async () => {
    const result = await sut.execute({
     name: "John Doe",
     username: "johndoe",
     email: "johndoe@example.com",
     password: "123456"
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
        viewer: inMemoryViewersRepository.items[0]
    });
  });

  it("should hash viewer password upon registration", async () => {
    const result = await sut.execute({
        name: "John Doe",
        username: "johndoe",
        email: "johndoe@example.com",
        password: "123456"
    });

    const hashedPassword = await fakeHasher.hash('123456')

    expect(result.isRight()).toBe(true);
    expect(inMemoryViewersRepository.items[0].password).toEqual(hashedPassword);
  });
});
