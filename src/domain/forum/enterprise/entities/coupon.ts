import { Entity } from "@/core/entities/entity";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Order } from "./order";

export enum DiscountTypeEnum {
  PERCENTAGE = "PERCENTAGE",
  VALUE = "VALUE",
}

export interface CouponProps {
  code: string;
  type: DiscountTypeEnum;
  discount: number;
  expiresIn: Date;
  wasUsed: boolean;
  isEnabled: boolean;
  orderId: string;
  order: Order;
  createdAt: Date;
  updatedAt: Date;
}

export class Coupon extends Entity<CouponProps> {
  get code() {
    return this.props.code;
  }

  get type() {
    return this.props.type;
  }

  get discount() {
    return this.props.discount;
  }

  get expiresIn() {
    return this.props.expiresIn;
  }

  get orderId() {
    return this.props.orderId;
  }

  get order() {
    return this.props.order;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  static create(props: CouponProps, id?: UniqueEntityID) {
    const coupon = new Coupon(props, id);

    return coupon;
  }
}
