import { GetEventBySlugUseCase } from "./get-event-by-slug";
import { Slug } from "../../enterprise/entities/value-objects/slug";
import { makeEvent } from "test/factories/make-event";
import { InMemoryEventAttachmentsRepository } from "test/repositories/in-memory-event-attachments-repository";
import { InMemoryEventsRepository } from "test/repositories/in-memory-event-repository";
import { InMemoryAttachmentsRepository } from "test/repositories/in-memory-attachments-repository";
import { InMemoryArtistsRepository } from "test/repositories/in-memory-artists-repository";
import { makeArtist } from "test/factories/make-artist";
import { makeAttachment } from "test/factories/make-attachment";
import { makeEventAttachment } from "test/factories/make-event-attachment";

let inMemoryEventAttachmentsRepository: InMemoryEventAttachmentsRepository;
let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository;
let inMemoryArtistsRepository: InMemoryArtistsRepository;
let inMemoryEventsRepository: InMemoryEventsRepository;
let sut: GetEventBySlugUseCase;

describe("Get Event By Slug", () => {
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
    sut = new GetEventBySlugUseCase(inMemoryEventsRepository);
  });

  it("should be able to get a event by slug", async () => {
    const artist = makeArtist({ name: "John Doe" });

    inMemoryArtistsRepository.items.push(artist);

    const newEvent = makeEvent({
      authorId: artist.id,
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
