import { DomainEvents } from "@/core/events/domain-events";
import { UserRepository } from "@/domain/forum/application/repositories/user-repository";
import { User } from "@/domain/forum/enterprise/entities/user";

export class InMemoryUsersRepository implements UserRepository {
  public items: User[] = [];

  async findByEmail(email: string) {
    const user = this.items.find((item) => item.email.toString() === email);

    if (!user) {
      return null;
    }

    return user;
  }

  async findByUsername(username: string) {
    const user = this.items.find(
      (item) => item.username.toString() === username
    );

    if (!user) {
      return null;
    }

    return user;
  }

  async create(user: User) {
    this.items.push(user);

    DomainEvents.dispatchEventsForAggregate(user.id);
  }
}