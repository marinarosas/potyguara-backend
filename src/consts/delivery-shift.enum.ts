import { registerEnumType } from '@nestjs/graphql'

export enum DeliveryShiftEnum {
  MORNING = 'MORNING',
  AFTERNOON = 'AFTERNOON',
}

registerEnumType(DeliveryShiftEnum, {
  name: 'DeliveryShiftEnum',
  description: 'Delivery shift preference',
})
