import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Product, ProductProps } from './product'
import { Cart, CartProps } from './cart'


export interface CartProductsProps {
    quantity: number
    product: Product
    productId: string
    cart: Cart
    cartId: string
    createdAt: Date;
    updatedAt: Date;
}

export class CartProducts extends Entity<CartProductsProps> {
  get quantity(){
    return this.props.quantity
  }

  get product(){
    return this.props.product
  }

  get productId(){
    return this.props.productId
  }

  get cart(){
    return this.props.productId
  }

  get cartId(){
    return this.props.productId
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  static create(props: CartProductsProps, id?: UniqueEntityID) {
    const cartproducts = new CartProducts(props, id)

    return cartproducts
  }
}
