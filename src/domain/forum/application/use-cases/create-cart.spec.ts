import { InMemoryCartRepository } from "test/repositories/in-memory-cart-repository";
import { CreateCartUseCase } from "./create-cart";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";

let inMemoryCartRepository: InMemoryCartRepository;

let sut: CreateCartUseCase;

describe("Create Cart", () => {
  beforeEach(() => {
    inMemoryCartRepository = new InMemoryCartRepository();
    sut = new CreateCartUseCase(inMemoryCartRepository);
  });

  it("should be able to create an cart", async () => {
    const result = await sut.execute({
      userId: "1",
      cartProducts: [],
    });

    expect(result.isRight()).toBe(true);
    expect(inMemoryCartRepository.items[0]).toEqual(result.value?.cart);
    expect(inMemoryCartRepository.items[0].userId).toEqual(new UniqueEntityID("1"));
  });
});
