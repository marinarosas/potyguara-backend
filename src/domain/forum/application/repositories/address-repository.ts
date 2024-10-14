import { Address } from '../../enterprise/entities/address'

export abstract class AddressRepository {
abstract  findById(id: string): Promise<Address | null>
abstract  findManyByAuthorId(userId: string): Promise<Address[]>
abstract  save(address: Address): Promise<void>
abstract  create(address: Address): Promise<void>
abstract  delete(address: Address): Promise<void>
}
