import { Controller, Get, UnauthorizedException, UseGuards } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { CurrentUser } from "@/auth/current-user-decorator";
import { JwtAuthGuard } from "@/auth/jwt-auth.guard";
import { UserPayload } from "@/auth/jwt.strategy";
import { PrismaService } from "@/prisma/prisma.service";


@Controller("/users/me")
@UseGuards(JwtAuthGuard)
export class ProfileController {
  constructor(
    private jwt: JwtService,
    private prisma: PrismaService) {}

  @Get()
  async handle( @CurrentUser() user: UserPayload) {
    const userId = user.sub;


    const userProfile = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if(!userProfile){
      throw new UnauthorizedException('User credetials do not match.')
    }

    const acessToken = this.jwt.sign({ sub: userId });

    return { userProfile, token: acessToken };
  }
}
