import { InMemoryEventsRepository } from "test/repositories/in-memory-event-repository";
import { CreateEventUseCase } from "./create-event";
import { InMemoryEventAttachmentsRepository } from "test/repositories/in-memory-event-attachments-repository";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { InMemoryAttachmentsRepository } from "test/repositories/in-memory-attachments-repository";
import { InMemoryViewersRepository } from "test/repositories/in-memory-viewer-repository";

let inMemoryEventAttachmentsRepository: InMemoryEventAttachmentsRepository;
let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository;
let inMemoryViewerRepository: InMemoryViewersRepository;
let inMemoryEventsRepository: InMemoryEventsRepository;

let sut: CreateEventUseCase;

describe("Create Events", () => {
  beforeEach(() => {
    inMemoryEventAttachmentsRepository =
      new InMemoryEventAttachmentsRepository();
    inMemoryAttachmentsRepository = new InMemoryAttachmentsRepository();
    inMemoryViewerRepository = new InMemoryViewersRepository();
    inMemoryEventsRepository = new InMemoryEventsRepository(
      inMemoryEventAttachmentsRepository,
      inMemoryAttachmentsRepository,
      inMemoryViewerRepository
    );
    sut = new CreateEventUseCase(inMemoryEventsRepository);
  });

  it("should be able to create a event", async () => {
    const result = await sut.execute({
      authorId: "1",
      title: "Nova pergunta",
      content: "Conteúdo da pergunta",
      price: 10,
      eventDate: "2023-12-31T23:59:59Z",
      eventTime: "2023-12-31T23:59:59Z",
      statusPayment: false,
      attachmentsIds: ["1", "2"],
    });

    expect(result.isRight()).toBe(true);
    expect(inMemoryEventsRepository.items[0]).toEqual(result.value?.event);
    expect(
      inMemoryEventsRepository.items[0].attachments.currentItems
    ).toHaveLength(2);
    expect(inMemoryEventsRepository.items[0].attachments.currentItems).toEqual([
      expect.objectContaining({ attachmentId: new UniqueEntityID("1") }),
      expect.objectContaining({ attachmentId: new UniqueEntityID("2") }),
    ]);
  });

  it("should persist attachments when creating a new event", async () => {
    const result = await sut.execute({
      authorId: "1",
      title: "Nova pergunta",
      content: "Conteúdo da pergunta",
      price: 10,
      eventDate: "2023-12-31T23:59:59Z",
      eventTime: "2023-12-31T23:59:59Z",
      statusPayment: false,
      attachmentsIds: ["1", "2"],
    });

    expect(result.isRight()).toBe(true);
    expect(inMemoryEventAttachmentsRepository.items).toHaveLength(2);
    expect(inMemoryEventAttachmentsRepository.items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          attachmentId: new UniqueEntityID("1"),
        }),
        expect.objectContaining({
          attachmentId: new UniqueEntityID("2"),
        }),
      ])
    );
  });
});
