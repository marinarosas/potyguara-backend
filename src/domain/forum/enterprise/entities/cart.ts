import { Entity } from "@/core/entities/entity";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { User } from "./user";
import { CartProductsProps } from "./cart-products";

export interface CartProps {
  user: User;
  userId: UniqueEntityID;
  cartProducts: CartProductsProps[];
  createdAt: Date;
  updatedAt: Date;
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

  static create(props: CartProps, id?: UniqueEntityID) {
    const cart = new Cart(props, id);

    return cart;
  }
}
