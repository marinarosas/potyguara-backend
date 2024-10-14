import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '../../../../core/errors/errors/resource-not-found-error'
import { NotAllowedError } from '../../../../core/errors/errors/not-allowed-error'
import { Injectable } from '@nestjs/common'
import { AddressRepository } from '../repositories/address-repository'

interface DeleteAddressUseCaseRequest {
  userId: string
  addressId: string
}

type DeleteAddressUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  null
>

@Injectable()
export class DeleteAddressUseCase {
  constructor(private addresssRepository: AddressRepository) {}

  async execute({
    addressId,
    userId,
  }: DeleteAddressUseCaseRequest): Promise<DeleteAddressUseCaseResponse> {
    const address = await this.addresssRepository.findById(addressId)

    if (!address) {
      return left(new ResourceNotFoundError())
    }

    if (userId !== address.userId.toString()) {
      return left(new NotAllowedError())
    }

    await this.addresssRepository.delete(address)

    return right(null)
  }
}
