import { DomainEvents } from "@/core/events/domain-events";
import { ViewerRepository } from "@/domain/forum/application/repositories/viewer-repository";
import { Viewer } from "@/domain/forum/enterprise/entities/viewer";

export class InMemoryViewersRepository implements ViewerRepository {
  public items: Viewer[] = [];

  async findByEmail(email: string) {
    const viewer = this.items.find((item) => item.email.toString() === email);

    if (!viewer) {
      return null;
    }

    return viewer;
  }

  async findByUsername(username: string) {
    const viewer = this.items.find(
      (item) => item.username.toString() === username
    );

    if (!viewer) {
      return null;
    }

    return viewer;
  }

  async create(viewer: Viewer) {
    this.items.push(viewer);

    DomainEvents.dispatchEventsForAggregate(viewer.id);
  }
}
