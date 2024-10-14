// import { faker } from '@faker-js/faker'
// import { UniqueEntityID } from '@/core/entities/unique-entity-id'
// import {
//   Product,
//   ProductProps,
// } from '@/domain/forum/enterprise/entities/product'
// import { Injectable } from '@nestjs/common'
// import { PrismaService } from '@/infra/database/prisma/prisma.service'
// import { makeOrderProducts } from './make-order-products'

// export function makeProduct(
//   override: Partial<ProductProps> = {},
//   id?: UniqueEntityID,
// ) {

//     const categories= 

//     const orderProducts = makeOrderProducts()

//     const cartProducts = 

//   const product = Product.create(
//     {
//       name: faker.lorem.sentences(),
//       description: faker.lorem.text(),
//       price: 0,
//       imgUrl: [],
//       productTime: faker.lorem.sentences(),
//       categories: false, 
//       orderProducts: false, 
//       cartProducts: false, 
//       ...override,
//     },
//     id,
//   )

//   return product
// }

// @Injectable()
// export class ProductFactory {
//   constructor(private prisma: PrismaService){}

//   async makePrismaProduct(data: Partial<ProductProps> = {}): Promise<Product>{
//     const product = makeProduct(data)

//     await this.prisma.product.create({
//       data: PrismaProductMapper.toPrisma(product)
//     })

//     return product
//   }
// }