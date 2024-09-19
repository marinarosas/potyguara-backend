import { InMemoryEventsRepository } from 'test/repositories/in-memory-event-repository'
import { FetchRecentEventsUseCase } from './fetch-recent-events'
import { makeEvent } from 'test/factories/make-event'

let inMemoryEventsRepository: InMemoryEventsRepository
let sut: FetchRecentEventsUseCase

describe('Fetch Recent Events', () => {
  beforeEach(() => {
    inMemoryEventsRepository = new InMemoryEventsRepository(
    )
    sut = new FetchRecentEventsUseCase(inMemoryEventsRepository)
  })

  it('should be able to fetch recent events', async () => {
    await inMemoryEventsRepository.create(
      makeEvent({ createdAt: new Date(2022, 0, 20) }),
    )

    await inMemoryEventsRepository.create(
      makeEvent({ createdAt: new Date(2022, 0, 18) }),
    )

    await inMemoryEventsRepository.create(
      makeEvent({ createdAt: new Date(2022, 0, 23) }),
    )

    const result = await sut.execute({
      page: 1,
    })

    expect(result.value?.events).toEqual([
      expect.objectContaining({ createdAt: new Date(2022, 0, 23) }),
      expect.objectContaining({ createdAt: new Date(2022, 0, 20) }),
      expect.objectContaining({ createdAt: new Date(2022, 0, 18) }),
    ])
  })

  it('should be able to fetch paginated recent events', async () => {
    for (let i = 1; i <= 22; i++) {
      await inMemoryEventsRepository.create(makeEvent())
    }

    const result = await sut.execute({
      page: 2,
    })

    expect(result.value?.events).toHaveLength(2)
  })
})
