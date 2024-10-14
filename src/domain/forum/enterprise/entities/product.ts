import { Entity } from "@/core/entities/entity";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Category } from "./category";
import { OrderProducts } from "./order-products";
import { CartProducts } from "./cart-products";

export interface ProductProps {
  name: string;
  description: string;
  price: number;
  imgUrl: string[];
  categories: Category[];
  orderProducts: OrderProducts[];
  cartProducts: CartProducts[];
  createdAt: Date;
  updatedAt: Date;
}

export class Product extends Entity<ProductProps> {
  get name() {
    return this.props.name;
  }

  get description() {
    return this.props.description;
  }

  get price() {
    return this.props.price;
  }

  get imgUrl() {
    return this.props.imgUrl;
  }

  get categories() {
    return this.props.categories;
  }

  get orderProducts() {
    return this.props.orderProducts;
  }

  get cartProducts() {
    return this.props.cartProducts;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  static create(props: ProductProps, id?: UniqueEntityID) {
    const product = new Product(props, id);

    return product;
  }
}
