import { DomainEvents } from "@/core/events/domain-events";
import { CartRepository } from "@/domain/forum/application/repositories/cart-repository";
import { Cart } from "@/domain/forum/enterprise/entities/cart";

export class InMemoryCartRepository implements CartRepository {
  public items: Cart[] = [];

  constructor() {}

  async findById(id: string) {
    const cart = this.items.find((item) => item.id.toString() === id);

    if (!cart) {
      return null;
    }

    return cart;
  }

  async create(cart: Cart) {
    this.items.push(cart);

    DomainEvents.dispatchEventsForAggregate(cart.id);
  }

  async findByUserId(userId: string) {
    const cart = this.items
      .filter((item) => item.userId.toString() === userId)
  
    return cart;
  }
}
