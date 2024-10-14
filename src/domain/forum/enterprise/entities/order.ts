import { Entity } from "@/core/entities/entity";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { User } from "./user";
import { Address } from "./address";
import { Coupon } from "./coupon";
import { OrderProducts } from "./order-products";

export interface OrderProps {
  orderNumber: number;
  status: string;
  paymentDate: Date;
  partialValue: number;
  discount?: number;
  totalValue: number;
  deliveryFee: number;
  deliveryDate: Date;
  orderProducts: OrderProducts[];
  userId: UniqueEntityID;
  couponId?: UniqueEntityID;
  addressId: UniqueEntityID;
  user: User;
  coupon?: Coupon;
  address: Address;
  createdAt: Date;
  updatedAt?: Date;
}
export class Order extends Entity<OrderProps> {
  get orderNumber() {
    return this.props.orderNumber;
  }

  get status() {
    return this.props.status;
  }

  get paymentDate() {
    return this.props.paymentDate;
  }

  get partialValue() {
    return this.props.partialValue;
  }

  get totalValue() {
    return this.props.totalValue;
  }

  get deliveryFee() {
    return this.props.deliveryFee;
  }

  get deliveryDate() {
    return this.props.deliveryDate;
  }

  get orderProducts() {
    return this.props.orderProducts;
  }

  get userId() {
    return this.props.userId;
  }

  get couponId() {
    return this.props.couponId;
  }

  get addressId() {
    return this.props.addressId;
  }

  get coupon() {
    return this.props.coupon;
  }

  get user() {
    return this.props.user;
  }

  get address() {
    return this.props.address;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  static create(props: OrderProps, id?: UniqueEntityID) {
    const order = new Order(props, id);

    return order;
  }
}
