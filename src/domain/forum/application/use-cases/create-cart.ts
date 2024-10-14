import { Cart } from "../../enterprise/entities/cart";
import { Either, right } from "@/core/either";
import { Injectable } from "@nestjs/common";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { CartRepository } from "../repositories/cart-repository";

interface CreateCartUseCaseRequest {
    userId: string
}

type CreateCartUseCaseResponse = Either<
  null,
  {
    cart: Cart;
  }
>;

@Injectable()
export class CreateCartUseCase {
  constructor(private cartRepository: CartRepository) {}

  async execute({
    userId,
  }: CreateCartUseCaseRequest): Promise<CreateCartUseCaseResponse> {
    const cart = Cart.create({
        userId: new UniqueEntityID(userId),
    });

    
    await this.cartRepository.create(cart);

    return right({
      cart,
    });
  }
}
