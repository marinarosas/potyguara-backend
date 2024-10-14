import { Address } from "../../enterprise/entities/address";
import { Either, left, right } from "@/core/either";
import { Injectable } from "@nestjs/common";
import { AddressRepository } from "../repositories/address-repository";
import { ResourceNotFoundError } from "@/core/errors/errors/resource-not-found-error";
import { NotAllowedError } from "@/core/errors/errors/not-allowed-error";
import { OrderProps } from "../../enterprise/entities/order";

interface EditAddressUseCaseRequest {
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
    // orders: OrderProps[]
    userId: string
    addressId: string
}

type EditAddressUseCaseResponse = Either<
ResourceNotFoundError | NotAllowedError,
  {
    address: Address;
  }
>;

@Injectable()
export class EditAddressUseCase {
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
    //   orders,
      userId,
      addressId,
  }: EditAddressUseCaseRequest): Promise<EditAddressUseCaseResponse> {
    const address = await this.addressRepository.findById(addressId)

    if(!address){
        return left(new ResourceNotFoundError())
    }
    if (userId !== address.userId.toString()) {
        return left(new NotAllowedError());
      }
  
      address.addressLine = addressLine;
      address.buildingNumber = buildingNumber;
      address.complement = complement
      address.referencePoint = referencePoint
      address.neighborhood = neighborhood
      address.city = city
      address.state = state
      address.zipCode = zipCode
      address.country = country
      address.description = description
    //   address.orders = orders
    
    await this.addressRepository.save(address);

    return right({
      address,
    });
  }
}
