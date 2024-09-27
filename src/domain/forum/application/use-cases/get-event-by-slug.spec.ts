import { GetEventBySlugUseCase } from "./get-event-by-slug";
import { Slug } from "../../enterprise/entities/value-objects/slug";
import { makeEvent } from "test/factories/make-event";
import { InMemoryEventAttachmentsRepository } from "test/repositories/in-memory-event-attachments-repository";
import { InMemoryEventsRepository } from "test/repositories/in-memory-event-repository";
import { InMemoryAttachmentsRepository } from "test/repositories/in-memory-attachments-repository";
import { makeAttachment } from "test/factories/make-attachment";
import { makeEventAttachment } from "test/factories/make-event-attachment";
import { InMemoryViewersRepository } from "test/repositories/in-memory-viewer-repository";
import { makeViewer } from "test/factories/make-viewer";

let inMemoryEventAttachmentsRepository: InMemoryEventAttachmentsRepository;
let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository;
let inMemoryViewersRepository: InMemoryViewersRepository;
let inMemoryEventsRepository: InMemoryEventsRepository;
let sut: GetEventBySlugUseCase;

describe("Get Event By Slug", () => {
  beforeEach(() => {
    inMemoryEventAttachmentsRepository =
      new InMemoryEventAttachmentsRepository();
    inMemoryAttachmentsRepository = new InMemoryAttachmentsRepository();
    inMemoryViewersRepository = new InMemoryViewersRepository();
    inMemoryEventsRepository = new InMemoryEventsRepository(
      inMemoryEventAttachmentsRepository,
      inMemoryAttachmentsRepository,
      inMemoryViewersRepository
    );
    sut = new GetEventBySlugUseCase(inMemoryEventsRepository);
  });

  it("should be able to get a event by slug", async () => {
    const viewer = makeViewer({ name: "John Doe" });

    inMemoryViewersRepository.items.push(viewer);

    const newEvent = makeEvent({
      authorId: viewer.id,
      slug: Slug.create("example-event"),
    });

    inMemoryEventsRepository.create(newEvent);

    const attachment = makeAttachment({
      title: "Some attachment",
    });

    inMemoryAttachmentsRepository.items.push(attachment);

    inMemoryEventAttachmentsRepository.items.push(
      makeEventAttachment({
        attachmentId: attachment.id,
        eventId: newEvent.id,
      })
    );

    const result = await sut.execute({
      slug: "example-event",
    });

    expect(result.value).toMatchObject({
      event: expect.objectContaining({
        title: newEvent.title,
        author: "John Doe",
        attachments: [
          expect.objectContaining({
            title: "Some attachment",
          }),
        ],
      }),
    });
  });
});
