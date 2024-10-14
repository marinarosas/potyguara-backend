import { GetEventBySlugUseCase } from "./get-event-by-slug";
import { Slug } from "../../enterprise/entities/value-objects/slug";
import { makeEvent } from "test/factories/make-event";
import { InMemoryEventAttachmentsRepository } from "test/repositories/in-memory-event-attachments-repository";
import { InMemoryEventsRepository } from "test/repositories/in-memory-event-repository";
import { InMemoryAttachmentsRepository } from "test/repositories/in-memory-attachments-repository";
import { makeAttachment } from "test/factories/make-attachment";
import { makeEventAttachment } from "test/factories/make-event-attachment";
import { InMemoryUsersRepository } from "test/repositories/in-memory-user-repository";
import { makeUser } from "test/factories/make-user";

let inMemoryEventAttachmentsRepository: InMemoryEventAttachmentsRepository;
let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryEventsRepository: InMemoryEventsRepository;
let sut: GetEventBySlugUseCase;

describe("Get Event By Slug", () => {
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
    sut = new GetEventBySlugUseCase(inMemoryEventsRepository);
  });

  it("should be able to get a event by slug", async () => {
    const user = makeUser({ name: "John Doe" });

    inMemoryUsersRepository.items.push(user);

    const newEvent = makeEvent({
      authorId: user.id,
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
