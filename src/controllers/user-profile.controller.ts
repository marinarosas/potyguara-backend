import { Controller, Get, UseGuards } from "@nestjs/common";
import { CurrentUser } from "src/auth/current-user-decorator";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { UserPayload } from "src/auth/jwt.strategy";
import { PrismaService } from "src/prisma/prisma.service";


@Controller("/users/me")
@UseGuards(JwtAuthGuard)
export class ProfileController {
  constructor(private prisma: PrismaService) {}

  @Get()
  async handle( @CurrentUser() user: UserPayload) {
    const userId = user.sub;


    const userProfile = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    return { userProfile };
  }
}
