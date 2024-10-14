import { Entity } from "@/core/entities/entity";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { User } from "./user";
import { OrderProps } from "./order";
import { Optional } from "@/core/types/optional";
import dayjs from "dayjs";

export interface AddressProps {
  addressLine: string;
  buildingNumber: string;
  complement?: string;
  referencePoint?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  description: string;
  isEnabled: boolean;
  orders?: OrderProps[];
  user?: User;
  userId: UniqueEntityID;
  createdAt: Date;
  updatedAt?: Date;
}
export class Address extends Entity<AddressProps> {
  get addressLine() {
    return this.props.addressLine;
  }

  set addressLine(addressLine: string) {
    this.props.addressLine = addressLine;
    this.touch();
  }

  get buildingNumber() {
    return this.props.buildingNumber;
  }

  set buildingNumber(buildingNumber: string) {
    this.props.buildingNumber = buildingNumber;
    this.touch();
  }

  get complement() {
    return this.props.complement;
  }

  set complement(complement: string) {
    this.props.complement = complement;
    this.touch();
  }

  get referencePoint() {
    return this.props.referencePoint;
  }

  set referencePoint(referencePoint: string) {
    this.props.referencePoint = referencePoint;
    this.touch();
  }

  get neighborhood() {
    return this.props.neighborhood;
  }

  set neighborhood(neighborhood: string) {
    this.props.neighborhood = neighborhood;
    this.touch();
  }

  get city() {
    return this.props.city;
  }

  set city(city: string) {
    this.props.city = city;
    this.touch();
  }

  get state() {
    return this.props.state;
  }

  set state(state: string) {
    this.props.state = state;
    this.touch();
  }

  get zipCode() {
    return this.props.zipCode;
  }

  set zipCode(zipCode: string) {
    this.props.zipCode = zipCode;
    this.touch();
  }

  get country() {
    return this.props.country;
  }

  set country(country: string) {
    this.props.country = country;
    this.touch();
  }

  get description() {
    return this.props.description;
  }

  set description(description: string) {
    this.props.description = description;
    this.touch();
  }

  get isEnabled() {
    return this.props.isEnabled;
  }

  get orders() {
    return this.props.orders;
  }

  set orders(orders: OrderProps[]) {
    this.props.orders = orders;
    this.touch();
  }

  get user() {
    return this.props.user;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get userId() {
    return this.props.userId;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  get isNew(): boolean {
    return dayjs().diff(this.createdAt, "days") <= 3;
  }

  private touch() {
    this.props.updatedAt = new Date();
  }

  static create(
    props: Optional<AddressProps, "createdAt">,
    id?: UniqueEntityID
  ) {
    const address = new Address(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id
    );

    return address;
  }
}
