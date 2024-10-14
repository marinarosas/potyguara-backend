import { InMemoryEventsRepository } from "test/repositories/in-memory-event-repository";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { NotAllowedError } from "../../../../core/errors/errors/not-allowed-error";
import { DeleteEventUseCase } from "./delete-event";
import { makeEvent } from "test/factories/make-event";
import { InMemoryEventAttachmentsRepository } from "test/repositories/in-memory-event-attachments-repository";
import { makeEventAttachment } from "test/factories/make-event-attachment";
import { InMemoryAttachmentsRepository } from "test/repositories/in-memory-attachments-repository";
import { InMemoryUsersRepository } from "test/repositories/in-memory-user-repository";
import { InMemoryAddressRepository } from "test/repositories/in-memory-address-repository";
import { CreateAddressUseCase } from "./create-address";
import { DeleteAddressUseCase } from "./delete-address";
import { makeAddress } from "test/factories/make-address";

let inMemoryAddressRepository: InMemoryAddressRepository;

let sut: DeleteAddressUseCase;

describe("Delete Event", () => {
  beforeEach(() => {
    inMemoryAddressRepository = new InMemoryAddressRepository();
    sut = new DeleteAddressUseCase(inMemoryAddressRepository);
  });

  it("should be able to delete an address", async () => {
    const newAddress = makeAddress(
      {
        userId: new UniqueEntityID("user-01"),
      },
      new UniqueEntityID("address-1")
    );

    await inMemoryAddressRepository.create(newAddress);

    await sut.execute({
      addressId: "address-1",
      userId: "user-01",
    });

    expect(inMemoryAddressRepository.items).toHaveLength(0);
  });

  it("should not be able to delete a event from another user", async () => {
    const newAddress = makeAddress(
        {
          userId: new UniqueEntityID("user-01"),
        },
        new UniqueEntityID("address-1")
      );

   await inMemoryAddressRepository.create(newAddress);

    const result = await sut.execute({
        addressId: "address-1",
        userId: "user-02",
      });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
