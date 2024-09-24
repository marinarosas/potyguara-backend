import { InMemoryEventsRepository } from "test/repositories/in-memory-event-repository";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { NotAllowedError } from "../../../../core/errors/errors/not-allowed-error";
import { DeleteEventUseCase } from "./delete-event";
import { makeEvent } from "test/factories/make-event";
import { InMemoryEventAttachmentsRepository } from "test/repositories/in-memory-event-attachments-repository";
import { makeEventAttachment } from "test/factories/make-event-attachment";
import { InMemoryAttachmentsRepository } from "test/repositories/in-memory-attachments-repository";
import { InMemoryArtistsRepository } from "test/repositories/in-memory-artists-repository";

let inMemoryEventAttachmentsRepository: InMemoryEventAttachmentsRepository;
let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository;
let inMemoryArtistsRepository: InMemoryArtistsRepository;
let inMemoryEventsRepository: InMemoryEventsRepository;
let sut: DeleteEventUseCase;

describe("Delete Event", () => {
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
    sut = new DeleteEventUseCase(inMemoryEventsRepository);
  });

  it("should be able to delete a event", async () => {
    const newEvent = makeEvent(
      { authorId: new UniqueEntityID("author-1") },
      new UniqueEntityID("event-1")
    );

    await inMemoryEventsRepository.create(newEvent);

    inMemoryEventAttachmentsRepository.items.push(
      makeEventAttachment({
        eventId: newEvent.id,
        attachmentId: new UniqueEntityID("1"),
      }),
      makeEventAttachment({
        eventId: newEvent.id,
        attachmentId: new UniqueEntityID("2"),
      })
    );

    await sut.execute({
      eventId: "event-1",
      authorId: "author-1",
    });

    expect(inMemoryEventsRepository.items).toHaveLength(0);
    expect(inMemoryEventAttachmentsRepository.items).toHaveLength(0);
  });

  it("should not be able to delete a event from another user", async () => {
    const newEvent = makeEvent(
      { authorId: new UniqueEntityID("author-1") },
      new UniqueEntityID("event-1")
    );

    await inMemoryEventsRepository.create(newEvent);

    const result = await sut.execute({
      eventId: "event-1",
      authorId: "author-2",
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
