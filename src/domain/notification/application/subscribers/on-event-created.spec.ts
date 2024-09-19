import {  OnEventCreated } from "./on-event-created";
import {
  InMemoryEventsRepository,
} from "test/repositories/in-memory-event-repository";
import {
  SendNotificationUseCase,
  SendNotificationUseCaseRequest,
  SendNotificationUseCaseResponse,
} from "../use-cases/send-notification";
import { InMemoryNotificationsRepository } from "test/repositories/in-memory-notifications-repository";
import { vi, SpyInstance } from "vitest";
import { waitFor } from "test/util/wait-for";
import { makeEvent } from "test/factories/make-event";

let inMemoryEventsRepository: InMemoryEventsRepository;
let inMemoryNotificationRepository: InMemoryNotificationsRepository;
let sendNotificationUseCase: SendNotificationUseCase;

let sendNotificationExecuteSpy: SpyInstance<
  [SendNotificationUseCaseRequest],
  Promise<SendNotificationUseCaseResponse>
>;

describe("On Event Created", () => {
  beforeEach(() => {
    inMemoryEventsRepository = new InMemoryEventsRepository();
    inMemoryNotificationRepository = new InMemoryNotificationsRepository();
    sendNotificationUseCase = new SendNotificationUseCase(
      inMemoryNotificationRepository
    );

    sendNotificationExecuteSpy = vi.spyOn(sendNotificationUseCase, "execute");

    new OnEventCreated(inMemoryEventsRepository, sendNotificationUseCase);
  });
  
  it("should send a notification when an event is created", async () => {
    const event = makeEvent();

    inMemoryEventsRepository.create(event);

    await waitFor(() => {
      expect(sendNotificationExecuteSpy).toHaveBeenCalled();
    });
  });
});
