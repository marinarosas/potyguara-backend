import { registerEnumType } from '@nestjs/graphql'

export enum RipenessEnum {
  UNRIPE = 'UNRIPE',
  RIPE = 'RIPE',
}

registerEnumType(RipenessEnum, {
  name: 'RipenessEnum',
  description: 'Describes if a fruit is ripe or green',
})
