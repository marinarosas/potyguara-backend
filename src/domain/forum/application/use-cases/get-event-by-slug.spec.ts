import { GetEventBySlugUseCase } from "./get-event-by-slug";
import { Slug } from "../../enterprise/entities/value-objects/slug";
import { makeEvent } from "test/factories/make-event";
import { InMemoryEventAttachmentsRepository } from "test/repositories/in-memory-event-attachments-repository";
import { InMemoryEventsRepository } from "test/repositories/in-memory-event-repository";

let inMemoryEventAttachmentsRepository: InMemoryEventAttachmentsRepository;
let inMemoryEventsRepository: InMemoryEventsRepository;
let sut: GetEventBySlugUseCase;

describe("Get Event By Slug", () => {
  beforeEach(() => {
    inMemoryEventAttachmentsRepository = new InMemoryEventAttachmentsRepository()
    inMemoryEventsRepository = new InMemoryEventsRepository(inMemoryEventAttachmentsRepository);
    sut = new GetEventBySlugUseCase(inMemoryEventsRepository);
  });

  it("should be able to get a event by slug", async () => {
    const newEvent = makeEvent({
      slug: Slug.create("example-event"),
    });

    inMemoryEventsRepository.create(newEvent);

    const result = await sut.execute({
      slug: "example-event",
    });

    expect(result.value).toMatchObject({
      event: expect.objectContaining({ title: newEvent.title }),
    });
  });
});
