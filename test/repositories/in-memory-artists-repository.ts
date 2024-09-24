import { DomainEvents } from "@/core/events/domain-events";
import { ArtistsRepository } from "@/domain/forum/application/repositories/artists-repository";
import { Artist } from "@/domain/forum/enterprise/entities/artist";

export class InMemoryArtistsRepository implements ArtistsRepository {
  public items: Artist[] = [];

  async findByEmail(email: string) {
    const artist = this.items.find((item) => item.email.toString() === email);

    if (!artist) {
      return null;
    }

    return artist;
  }

  async findByUsername(username: string) {
    const artist = this.items.find(
      (item) => item.username.toString() === username
    );

    if (!artist) {
      return null;
    }

    return artist;
  }

  async create(artist: Artist) {
    this.items.push(artist);

    DomainEvents.dispatchEventsForAggregate(artist.id);
  }
}
