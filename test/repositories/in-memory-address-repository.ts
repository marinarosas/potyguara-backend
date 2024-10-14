import { AddressRepository } from "@/domain/forum/application/repositories/address-repository";
import { Address } from "@/domain/forum/enterprise/entities/address";
import { DomainEvents } from "@/core/events/domain-events";

export class InMemoryAddressRepository implements AddressRepository {
  public items: Address[] = [];

  constructor() {}

  async findById(id: string) {
    const address = this.items.find((item) => item.id.toString() === id);

    if (!address) {
      return null;
    }

    return address;
  }

  async findManyByAuthorId(userId: string) {
    const addresses = this.items
      .filter((item) => item.userId.toString() === userId)
  

    return addresses;
  }

  async create(address: Address) {
    this.items.push(address);

    DomainEvents.dispatchEventsForAggregate(address.id);
  }

  async save(address: Address): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id === address.id);

    this.items[itemIndex] = address;

    DomainEvents.dispatchEventsForAggregate(address.id);
  }

  async delete(address: Address) {
    const itemIndex = this.items.findIndex((item) => item.id === address.id);

    this.items.splice(itemIndex, 1);
  }
}
