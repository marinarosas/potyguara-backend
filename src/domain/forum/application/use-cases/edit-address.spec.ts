import { InMemoryAddressRepository } from "test/repositories/in-memory-address-repository";
import { EditAddressUseCase } from "./edit-address";
import { makeAddress } from "test/factories/make-address";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";

let inMemoryAddressRepository: InMemoryAddressRepository;

let sut: EditAddressUseCase;

describe("Edit Address", () => {
  beforeEach(() => {
    inMemoryAddressRepository = new InMemoryAddressRepository();
    sut = new EditAddressUseCase(inMemoryAddressRepository);
  });

  it("should be able to edit an address", async () => {
    const newAddress = makeAddress(
      {
        userId: new UniqueEntityID("user-01"),
      },
      new UniqueEntityID("address-1")
    );

    await inMemoryAddressRepository.create(newAddress);

    await sut.execute({
      addressLine: "Rua Em Algum Lugar",
      buildingNumber: "14A",
      complement: "Casa 7",
      referencePoint: "Perto do Posto",
      neighborhood: "Bairro",
      city: "Cidade",
      state: "Estado",
      zipCode: "59000-999",
      country: "Brasil",
      description: "Descrição 1",
      userId: "user-01",
      addressId: newAddress.id.toValue(),
      //   orders: [],
    });

    expect(inMemoryAddressRepository.items[0]).toMatchObject({
      addressLine: "Rua Em Algum Lugar",
      buildingNumber: "14A",
    });
  });
  // expect(
  //   inMemoryAddressRepository.items[0].attachments.currentItems
  // ).toHaveLength(2);
  // expect(inMemoryAddressRepository.items[0].attachments.currentItems).toEqual([
  //   expect.objectContaining({ attachmentId: new UniqueEntityID("1") }),
  //   expect.objectContaining({ attachmentId: new UniqueEntityID("3") }),
  // ]);
});
