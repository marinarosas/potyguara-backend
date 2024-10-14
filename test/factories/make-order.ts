// import { faker } from '@faker-js/faker'
// import { UniqueEntityID } from '@/core/entities/unique-entity-id'
// import { Order, OrderProps } from '@/domain/forum/enterprise/entities/order'
// import { Injectable } from '@nestjs/common'
// import { PrismaService } from '@/infra/database/prisma/prisma.service'
// import { makeUser } from './make-user'
// import { FakeHasher } from 'test/cryptography/fake-hasher'
// import { makeAddress } from './make-address'
// import { OrderProducts } from '@/domain/forum/enterprise/entities/order-products'

// export function makeOrder(
//   override: Partial<OrderProps> = {},
//   id?: UniqueEntityID,
// ) {


//     const user = makeUser();

//       const address = makeAddress();

//   const order = Order.create(
//     {
//         status: faker.lorem.word(),
//         paymentDate: new Date(),
//         partialValue: faker.number.float(),
//         totalValue: faker.number.float(),
//         deliveryFee: faker.number.float(),
//         deliveryDate: new Date(),
//         orderProducts: OrderProducts[],
//         userId: new UniqueEntityID(),
//         addressId: new UniqueEntityID(),
//         address,
//         user,
//         address,
//       ...override,
//     },
//     id,
//   )

//   return order
// }

// @Injectable()
// export class OrderFactory {
//   constructor(private prisma: PrismaService){}

//   async makePrismaOrder(data: Partial<OrderProps> = {}): Promise<Order>{
//     const order = makeOrder(data)

//     await this.prisma.order.create({
//       data: PrismaOrderMapper.toPrisma(order)
//     })

//     return order
//   }
// }
