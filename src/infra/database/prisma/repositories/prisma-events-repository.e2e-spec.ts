import { EventsRepository } from "@/domain/forum/application/repositories/events-repository";
import { AppModule } from "@/infra/app.module";
import { CacheRepository } from "@/infra/cache/cache-repository";
import { CacheModule } from "@/infra/cache/cache.module";
import { DatabaseModule } from "@/infra/database/database.module";
import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { AttachmentFactory } from "test/factories/make-attachment";
import { EventFactory } from "test/factories/make-event";
import { EventAttachmentFactory } from "test/factories/make-event-attachment";
import { UserFactory } from "test/factories/make-user";

describe("Prisma Event Repository (E2E)", () => {
  let app: INestApplication;
  let userFactory: UserFactory;
  let eventFactory: EventFactory;
  let attachmentFactory: AttachmentFactory;
  let eventAttachmentFactory: EventAttachmentFactory;
  let cacheRepository: CacheRepository;
  let eventsRepository: EventsRepository;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule, CacheModule],
      providers: [
        UserFactory,
        EventFactory,
        AttachmentFactory,
        EventAttachmentFactory,
      ],
    }).compile();

    app = moduleRef.createNestApplication();

    userFactory = moduleRef.get(UserFactory);
    eventFactory = moduleRef.get(EventFactory);
    attachmentFactory = moduleRef.get(AttachmentFactory);
    eventAttachmentFactory = moduleRef.get(EventAttachmentFactory);
    cacheRepository = moduleRef.get(CacheRepository);
    eventsRepository = moduleRef.get(EventsRepository);

    await app.init();
  });

  it("should cache event details", async () => {
    const user = await userFactory.makePrismaUser();

    const event = await eventFactory.makePrismaEvent({
      authorId: user.id,
    });

    const attachment = await attachmentFactory.makePrismaAttachment();

    await eventAttachmentFactory.makePrismaEventAttachment({
      attachmentId: attachment.id,
      eventId: event.id,
    });

    const slug = event.slug.value;

    const eventDetails = await eventsRepository.findDetailsBySlug(slug);

    const cached = await cacheRepository.get(`event:${slug}:details`);

    if (!cached) {
      throw new Error();
    }

    expect(JSON.parse(cached)).toEqual(
      expect.objectContaining({
        id: eventDetails.eventId.toString(),
      })
    );
  });

  it("should return cached event details on subsequent calls", async () => {
    const user = await userFactory.makePrismaUser();

    const event = await eventFactory.makePrismaEvent({
      authorId: user.id,
    });

    const attachment = await attachmentFactory.makePrismaAttachment();

    await eventAttachmentFactory.makePrismaEventAttachment({
      attachmentId: attachment.id,
      eventId: event.id,
    });

    const slug = event.slug.value;

    let cached = await cacheRepository.get(`event:${slug}:details`);

    expect(cached).toBeNull();

    await eventsRepository.findDetailsBySlug(slug);

    cached = await cacheRepository.get(`event:${slug}:details`);

    expect(cached).not.toBeNull();

    const eventDetails = await eventsRepository.findDetailsBySlug(slug);

    if (!cached) {
      throw new Error();
    }

    expect(JSON.parse(cached)).toEqual(
      expect.objectContaining({
        id: eventDetails.eventId.toString(),
      })
    );
  });

  it("should reset event details cache when saving the event", async () => {
    const user = await userFactory.makePrismaUser();

    const event = await eventFactory.makePrismaEvent({
      authorId: user.id,
    });

    const attachment = await attachmentFactory.makePrismaAttachment();

    await eventAttachmentFactory.makePrismaEventAttachment({
      attachmentId: attachment.id,
      eventId: event.id,
    });

    const slug = event.slug.value;

    await cacheRepository.set(
      `event:${slug}:details`,
      JSON.stringify({ empty: true })
    );

    await eventsRepository.save(event);

    const cached = await cacheRepository.get(`event:${slug}:details`);

    expect(cached).toBeNull();
  });
});
