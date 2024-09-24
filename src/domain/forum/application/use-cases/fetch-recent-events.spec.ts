import { InMemoryEventsRepository } from "test/repositories/in-memory-event-repository";
import { FetchRecentEventsUseCase } from "./fetch-recent-events";
import { makeEvent } from "test/factories/make-event";
import { InMemoryAttachmentsRepository } from "test/repositories/in-memory-attachments-repository";
import { InMemoryArtistsRepository } from "test/repositories/in-memory-artists-repository";
import { InMemoryEventAttachmentsRepository } from "test/repositories/in-memory-event-attachments-repository";

let inMemoryEventAttachmentsRepository: InMemoryEventAttachmentsRepository;
let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository;
let inMemoryArtistsRepository: InMemoryArtistsRepository;
let inMemoryEventsRepository: InMemoryEventsRepository;
let sut: FetchRecentEventsUseCase;

describe("Fetch Recent Events", () => {
  beforeEach(() => {
    inMemoryEventAttachmentsRepository =
      new InMemoryEventAttachmentsRepository();
    inMemoryAttachmentsRepository = new InMemoryAttachmentsRepository();
    inMemoryArtistsRepository = new InMemoryArtistsRepository();
    inMemoryEventsRepository = new InMemoryEventsRepository(
      inMemoryEventAttachmentsRepository,
      inMemoryAttachmentsRepository,
      inMemoryArtistsRepository
    );
    sut = new FetchRecentEventsUseCase(inMemoryEventsRepository);
  });

  it("should be able to fetch recent events", async () => {
    await inMemoryEventsRepository.create(
      makeEvent({ createdAt: new Date(2022, 0, 20) })
    );

    await inMemoryEventsRepository.create(
      makeEvent({ createdAt: new Date(2022, 0, 18) })
    );

    await inMemoryEventsRepository.create(
      makeEvent({ createdAt: new Date(2022, 0, 23) })
    );

    const result = await sut.execute({
      page: 1,
    });

    expect(result.value?.events).toEqual([
      expect.objectContaining({ createdAt: new Date(2022, 0, 23) }),
      expect.objectContaining({ createdAt: new Date(2022, 0, 20) }),
      expect.objectContaining({ createdAt: new Date(2022, 0, 18) }),
    ]);
  });

  it("should be able to fetch paginated recent events", async () => {
    for (let i = 1; i <= 22; i++) {
      await inMemoryEventsRepository.create(makeEvent());
    }

    const result = await sut.execute({
      page: 2,
    });

    expect(result.value?.events).toHaveLength(2);
  });
});
