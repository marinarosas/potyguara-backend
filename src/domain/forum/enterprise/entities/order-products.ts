import { Entity } from "@/core/entities/entity";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Order } from "./order";
import { Product } from "./product";

export interface OrderProductsProps {
  quantity: number;
  unitPrice: number;
  totalValue: number;
  comment: string;
  order: Order;
  orderId: string;
  product: Product;
  productId: string;
  createdAt: Date;
  updatedAt: Date;
}

export class OrderProducts extends Entity<OrderProductsProps> {
  get quantity() {
    return this.props.quantity;
  }

  get unitPrice() {
    return this.props.unitPrice;
  }

  get totalValue() {
    return this.props.totalValue;
  }

  get comment() {
    return this.props.comment;
  }

  get order() {
    return this.props.order;
  }

  get orderId() {
    return this.props.orderId;
  }

  get product() {
    return this.props.product;
  }

  get productId() {
    return this.props.productId;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  static create(props: OrderProductsProps, id?: UniqueEntityID) {
    const orderproducts = new OrderProducts(props, id);

    return orderproducts;
  }
}
