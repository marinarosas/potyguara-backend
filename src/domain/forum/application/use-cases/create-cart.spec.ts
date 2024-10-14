import { InMemoryAddressRepository } from "test/repositories/in-memory-address-repository";
import { CreateAddressUseCase } from "./create-address";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";

let inMemoryAddressRepository: InMemoryAddressRepository;

let sut: CreateAddressUseCase;

describe("Create Address", () => {
  beforeEach(() => {
    inMemoryAddressRepository = new InMemoryAddressRepository();
    sut = new CreateAddressUseCase(inMemoryAddressRepository);
  });

  it("should be able to create an address", async () => {
    const result = await sut.execute({
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
      isEnabled: true,
      userId: "1",
    });

    expect(result.isRight()).toBe(true);
    expect(inMemoryAddressRepository.items[0]).toEqual(result.value?.address);
    expect(inMemoryAddressRepository.items[0].userId).toEqual(new UniqueEntityID("1"));
  });
});
