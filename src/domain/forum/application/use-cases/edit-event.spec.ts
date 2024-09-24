import { InMemoryEventsRepository } from "test/repositories/in-memory-event-repository";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { EditEventUseCase } from "./edit-event";
import { NotAllowedError } from "../../../../core/errors/errors/not-allowed-error";
import { makeEvent } from "test/factories/make-event";
import { InMemoryEventAttachmentsRepository } from "test/repositories/in-memory-event-attachments-repository";
import { InMemoryAttachmentsRepository } from "test/repositories/in-memory-attachments-repository";
import { InMemoryArtistsRepository } from "test/repositories/in-memory-artists-repository";

let inMemoryEventAttachmentsRepository: InMemoryEventAttachmentsRepository;
let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository;
let inMemoryArtistsRepository: InMemoryArtistsRepository;
let inMemoryEventsRepository: InMemoryEventsRepository;
let sut: EditEventUseCase;

describe("Edit Event", () => {
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
    sut = new EditEventUseCase(
      inMemoryEventsRepository,
      inMemoryEventAttachmentsRepository
    );
  });

  it("should be able to edit a event", async () => {
    const newEvent = makeEvent(
      { authorId: new UniqueEntityID("author-1") },
      new UniqueEntityID("event-1")
    );

    await inMemoryEventsRepository.create(newEvent);

    await sut.execute({
      eventId: newEvent.id.toValue(),
      authorId: "author-1",
      title: "Evento teste",
      content: "Conteúdo teste",
      price: 0,
      statusPayment: false,
      attachmentsIds: ["1", "3"],
    });

    expect(inMemoryEventsRepository.items[0]).toMatchObject({
      title: "Evento teste",
      content: "Conteúdo teste",
    });
    expect(
      inMemoryEventsRepository.items[0].attachments.currentItems
    ).toHaveLength(2);
    expect(inMemoryEventsRepository.items[0].attachments.currentItems).toEqual([
      expect.objectContaining({ attachmentId: new UniqueEntityID("1") }),
      expect.objectContaining({ attachmentId: new UniqueEntityID("3") }),
    ]);
  });

  it("should not be able to edit a question from another user", async () => {
    const newEvent = makeEvent(
      { authorId: new UniqueEntityID("author-1") },
      new UniqueEntityID("event-1")
    );

    await inMemoryEventsRepository.create(newEvent);

    const result = await sut.execute({
      eventId: newEvent.id.toValue(),
      authorId: "author-2",
      title: "Pergunta teste",
      content: "Conteúdo teste",
      price: 0,
      statusPayment: false,
      attachmentsIds: [],
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });

  it("should sync new and removed attachments when ediitng a event", async () => {
    const newEvent = makeEvent(
      { authorId: new UniqueEntityID("author-1") },
      new UniqueEntityID("event-1")
    );

    await inMemoryEventsRepository.create(newEvent);

    const result = await sut.execute({
      eventId: newEvent.id.toValue(),
      authorId: "author-1",
      title: "Evento teste",
      content: "Conteúdo teste",
      price: 0,
      statusPayment: false,
      attachmentsIds: ["1", "3"],
    });

    expect(result.isRight()).toBe(true);
    expect(inMemoryEventAttachmentsRepository.items).toHaveLength(2);
    expect(inMemoryEventAttachmentsRepository.items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          attachmentId: new UniqueEntityID("1"),
        }),
        expect.objectContaining({
          attachmentId: new UniqueEntityID("3"),
        }),
      ])
    );
  });
});
