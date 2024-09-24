import { Artist } from '../../enterprise/entities/artist';

export abstract class ArtistsRepository {
abstract  findByEmail(email: string): Promise<Artist | null>
abstract  findByUsername(username: string): Promise<Artist | null>
abstract  create(artist: Artist): Promise<void>
}
