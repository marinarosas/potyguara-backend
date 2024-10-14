import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Address } from "@/domain/forum/enterprise/entities/address";
import { Address as PrismaAddress, Prisma } from "@prisma/client";

export class PrismaAddressMapper {
  static toDomain(raw: PrismaAddress): Address {
    return Address.create(
      {
        addressLine: raw.addressLine,
        buildingNumber: raw.buildingNumber,
        complement: raw.complement,
        referencePoint: raw.referencePoint,
        neighborhood: raw.neighborhood,
        city: raw.city,
        state: raw.state,
        zipCode: raw.zipCode,
        country: raw.country, 
        description: raw.description,
        isEnabled: raw.isEnabled,
        userId: raw.userId,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityID(raw.id)
    );
  }

  static toPrisma(address: Address): Prisma.AddressUncheckedCreateInput {
    return {
        id: address.id.toString(),
        addressLine: address.addressLine,
        buildingNumber: address.buildingNumber,
        complement: address.complement,
        referencePoint: address.referencePoint,
        neighborhood: address.neighborhood,
        city: address.city,
        state: address.state,
        zipCode: address.zipCode,
        country: address.country, 
        description: address.description,
        isEnabled: address.isEnabled,
        userId: address.userId,
        createdAt: address.createdAt,
        updatedAt: address.updatedAt,
    };
  }
}
