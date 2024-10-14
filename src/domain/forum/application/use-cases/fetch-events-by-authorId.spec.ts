import { InMemoryEventsRepository } from "test/repositories/in-memory-event-repository";
import { makeEvent } from "test/factories/make-event";
import { InMemoryAttachmentsRepository } from "test/repositories/in-memory-attachments-repository";
import { InMemoryEventAttachmentsRepository } from "test/repositories/in-memory-event-attachments-repository";
import { InMemoryUsersRepository } from "test/repositories/in-memory-user-repository";
import { makeUser } from "test/factories/make-user";
import { FakeHasher } from "test/cryptography/fake-hasher";
import { FetchEventsByAuthorIdUseCase } from "./fetch-events-by-authorId";

let inMemoryEventAttachmentsRepository: InMemoryEventAttachmentsRepository;
let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryEventsRepository: InMemoryEventsRepository;
let sut: FetchEventsByAuthorIdUseCase;
let fakeHasher: FakeHasher;

describe("Fetch Recent Events By AuthorId", () => {
  beforeEach(() => {
    inMemoryEventAttachmentsRepository =
      new InMemoryEventAttachmentsRepository();
    inMemoryAttachmentsRepository = new InMemoryAttachmentsRepository();
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryEventsRepository = new InMemoryEventsRepository(
      inMemoryEventAttachmentsRepository,
      inMemoryAttachmentsRepository,
      inMemoryUsersRepository
    );
    sut = new FetchEventsByAuthorIdUseCase(inMemoryEventsRepository);
    fakeHasher = new FakeHasher();
  });

  it("should be able to fetch recent events by Author id", async () => {
    const user = makeUser({
      email: "johndoe@example.com",
      password: await fakeHasher.hash("123456"),
    });

    await inMemoryEventsRepository.create(
      makeEvent({
        authorId: user.id,
        createdAt: new Date(2022, 0, 20),
      })
    );

    await inMemoryEventsRepository.create(
      makeEvent({ authorId: user.id, createdAt: new Date(2022, 0, 18) })
    );

    await inMemoryEventsRepository.create(
      makeEvent({ authorId: user.id, createdAt: new Date(2022, 0, 23) })
    );

    const result = await sut.execute({
      authorId: user.id.toString(),
      page: 1,
    });

    expect(result.value?.events).toEqual([
      expect.objectContaining({authorId: user.id, createdAt: new Date(2022, 0, 23) }),
      expect.objectContaining({authorId: user.id, createdAt: new Date(2022, 0, 20) }),
      expect.objectContaining({authorId: user.id, createdAt: new Date(2022, 0, 18) }),
    ]);
  });

  it("should be able to fetch paginated recent events", async () => {
    const user = makeUser({
      email: "johndoe@example.com",
      password: await fakeHasher.hash("123456"),
    });

    for (let i = 1; i <= 22; i++) {
      await inMemoryEventsRepository.create(makeEvent({authorId: user.id}));
    }

    const result = await sut.execute({
      authorId: user.id.toString(),
      page: 2,
    });

    expect(result.value?.events).toHaveLength(2);
  });
});
