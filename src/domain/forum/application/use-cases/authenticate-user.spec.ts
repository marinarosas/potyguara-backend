import { FakeHasher } from "test/cryptography/fake-hasher";
import { FakeEncrypter } from "test/cryptography/fake-encrypter";
import { makeUser } from "test/factories/make-user";
import { AuthenticateUserUseCase } from "./authenticate.user";
import { InMemoryUsersRepository } from "test/repositories/in-memory-user-repository";

let inMemoryUsersRepository: InMemoryUsersRepository;
let fakeHasher: FakeHasher;
let fakeEncrypter: FakeEncrypter;

let sut: AuthenticateUserUseCase;

describe("Authenticate User", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    fakeHasher = new FakeHasher();
    fakeEncrypter = new FakeEncrypter();

    sut = new AuthenticateUserUseCase(
      inMemoryUsersRepository,
      fakeHasher,
      fakeEncrypter
    );
  });

  it("should be able to authenticate a user", async () => {
    const user = makeUser({
      email: "johndoe@example.com",
      password: await fakeHasher.hash("123456"),
    });

    inMemoryUsersRepository.items.push(user);

    const result = await sut.execute({
      email: "johndoe@example.com",
      password: "123456",
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      user: expect.objectContaining({
        email: "johndoe@example.com"
      }),
      accessToken: expect.any(String),
    });
  });
});