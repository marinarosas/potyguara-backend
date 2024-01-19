import { Controller, Post } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'

@Controller('/accounts')
export class CreateAccountController {
  constructor(private prisma: PrismaService) {}

  @Post()
  async handle() {
    const name = 'John Doe'
    const email = 'johndoe@gmail.com'
    const password = '123456'
    const avatarURL = 'http//www.google.com.br'
    const cpf = '999.999.999-99'
    const birthday = '01/01/2004'
    const celphone = '(84)99999-9999'
    const artisticName = 'Doe J'
    const instagramLink = 'http://www.instagram.com'
    const facebookLink = 'http://www.instagram.com'

    await this.prisma.user.create({
      data: {
        name,
        email,
        password,
        avatarURL,
        cpf,
        birthday,
        celphone,
        artisticName,
        instagramLink,
        facebookLink,
      },
    })
  }
}
