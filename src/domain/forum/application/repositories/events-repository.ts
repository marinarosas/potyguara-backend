import { PaginationParams } from '@/core/repositories/pagination-params'
import { Event } from '../../enterprise/entities/event'
import { EventDetails } from '../../enterprise/entities/value-objects/event-details'

export abstract class EventsRepository {
abstract  findById(id: string): Promise<Event | null>
abstract  findBySlug(slug: string): Promise<Event | null>
abstract  findDetailsBySlug(slug: string): Promise<EventDetails | null>
abstract  findManyRecent(params: PaginationParams): Promise<Event[]>
abstract  findManyByAuthorId(authorId: string, params: PaginationParams): Promise<Event[]>
abstract  save(event: Event): Promise<void>
abstract  create(event: Event): Promise<void>
abstract  delete(event: Event): Promise<void>
}
