import { Address } from "../../enterprise/entities/address";
import { Either, right } from "@/core/either";
import { Injectable } from "@nestjs/common";
import { AddressRepository } from "../repositories/address-repository";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";

interface CreateAddressUseCaseRequest {
    addressLine: string
    buildingNumber: string
    complement?: string
    referencePoint?: string
    neighborhood: string
    city: string
    state: string
    zipCode: string
    country: string 
    description?: string
    isEnabled: boolean
    userId?: string
}

type CreateAddressUseCaseResponse = Either<
  null,
  {
    address: Address;
  }
>;

@Injectable()
export class CreateAddressUseCase {
  constructor(private addressRepository: AddressRepository) {}

  async execute({
    addressLine,
    buildingNumber,
    complement,
    referencePoint,
    neighborhood,
    city,
    state,
    zipCode,
    country, 
    description,
    isEnabled,
    userId,
  }: CreateAddressUseCaseRequest): Promise<CreateAddressUseCaseResponse> {
    const address = Address.create({
        addressLine,
        buildingNumber,
        complement,
        referencePoint,
        neighborhood,
        city,
        state,
        zipCode,
        country, 
        description,
        isEnabled,
        userId: new UniqueEntityID(userId),
    });

    
    await this.addressRepository.create(address);

    return right({
      address,
    });
  }
}
