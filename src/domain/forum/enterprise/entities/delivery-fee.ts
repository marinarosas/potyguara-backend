import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'


export interface CartProps {
    neighborhood: string
    fee: number
    createdAt: Date;
    updatedAt: Date;
}

export class Cart extends Entity<CartProps> {
  get neighborhood(){
    return this.props.neighborhood
  }

  get fee(){
    return this.props.fee
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  static create(props: CartProps, id?: UniqueEntityID) {
    const cart = new Cart(props, id)

    return cart
  }
}
