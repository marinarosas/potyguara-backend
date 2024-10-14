import { Entity } from "@/core/entities/entity";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { User } from "./user";
import { CartProductsProps } from "./cart-products";
import { Optional } from "@/core/types/optional";

export interface CartProps {
  user?: User;
  userId: UniqueEntityID;
  cartProducts: CartProductsProps[];
  createdAt: Date;
  updatedAt?: Date;
}

export class Cart extends Entity<CartProps> {
  get cartProducts() {
    return this.props.cartProducts;
  }

  get user() {
    return this.props.user;
  }

  get userId() {
    return this.props.userId;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  static create(
    props: Optional<CartProps, "createdAt">,
    id?: UniqueEntityID
  ) {
    const cart = new Cart(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id
    );

    return cart;
  }
}
