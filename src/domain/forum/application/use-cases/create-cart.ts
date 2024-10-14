import { Cart } from "../../enterprise/entities/cart";
import { Either, right } from "@/core/either";
import { Injectable } from "@nestjs/common";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { CartRepository } from "../repositories/cart-repository";
import { CartProductsProps } from "../../enterprise/entities/cart-products";

interface CreateCartUseCaseRequest {
  userId: string;
  cartProducts: CartProductsProps[];
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
    cartProducts,
  }: CreateCartUseCaseRequest): Promise<CreateCartUseCaseResponse> {
    const cart = Cart.create({
      userId: new UniqueEntityID(userId),
      cartProducts,
    });

    await this.cartRepository.create(cart);

    return right({
      cart,
    });
  }
}
