import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'


export interface DeliveryFeeProps {
    neighborhood: string
    fee: number
    createdAt: Date;
    updatedAt: Date;
}

export class DeliveryFee extends Entity<DeliveryFeeProps> {
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

  static create(props: DeliveryFeeProps, id?: UniqueEntityID) {
    const deliveryfee = new DeliveryFee(props, id)

    return deliveryfee
  }
}
