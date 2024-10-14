// import { faker } from '@faker-js/faker'
// import { UniqueEntityID } from '@/core/entities/unique-entity-id'
// import { Order, OrderProps } from '@/domain/forum/enterprise/entities/order'
// import { Injectable } from '@nestjs/common'
// import { PrismaService } from '@/infra/database/prisma/prisma.service'
// import { makeUser } from './make-user'
// import { FakeHasher } from 'test/cryptography/fake-hasher'
// import { makeAddress } from './make-address'
// import { OrderProducts } from '@/domain/forum/enterprise/entities/order-products'
// import { makeOrder } from './make-order'

// export function makeOrderProducts(
//   override: Partial<OrderProps> = {},
//   id?: UniqueEntityID,
// ) {

// //     const order = Order.create(
// //         {
// //             orderNumber: 0,
// //   status: faker.lorem.sentences(),
// //   paymentDate: new Date(),
// //   partialValue: 0,
// //   discount?: 0,
// //   totalValue: 0,
// //   deliveryFee: 0,
// //   deliveryDate: new Date(),
// // //   orderProducts: OrderProducts[];
// //   userId: faker.lorem.sentence(),
// //   addressId: faker.lorem.sentence(),
// // //   user: User;
// // //   address: Address;
// // ...override,},
// //         id,
// //       )
    

//       const address = makeAddress();

//   const order = OrderProducts.create(
//     {
//         quantity: faker.number.int(),
//         unitPrice: faker.number.float(),
//         totalValue: faker.number.float(),
//         comment: faker.lorem.text(),
//         order,
//         orderId: faker.lorem.slug();
// //   product: Product;
//   productId: faker.lorem.slug();
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
