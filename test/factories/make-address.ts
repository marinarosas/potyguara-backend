import { faker } from "@faker-js/faker";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import {
  Address,
  AddressProps,
} from "@/domain/forum/enterprise/entities/address";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { PrismaAddressMapper } from "@/infra/database/prisma/mapper/prisma-address-mapper";
import { makeUser } from "./make-user";

export function makeAddress(
  override: Partial<AddressProps> = {},
  id?: UniqueEntityID
) {

  const address = Address.create(
    {
      addressLine: faker.location.streetAddress(),
      buildingNumber: faker.location.buildingNumber(),
      complement: faker.lorem.text(),
      referencePoint: faker.lorem.text(),
      neighborhood: faker.location.street(),
      city: faker.location.city(),
      state: faker.location.state(),
      zipCode: faker.location.zipCode(),
      country: faker.location.country(),
      description: faker.lorem.text(),
      isEnabled: true,
      userId: new UniqueEntityID(),
      ...override,
    },
    id
  );

  return address;
}

@Injectable()
export class AddressFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaAddress(data: Partial<AddressProps> = {}): Promise<Address> {
    const address = makeAddress(data);

    await this.prisma.address.create({
      data: PrismaAddressMapper.toPrisma(address),
    });

    return address;
  }
}
