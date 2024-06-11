import { Controller, Get, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";

@Controller("/app/dashboard")
@UseGuards(JwtAuthGuard)
export class DashboardController {
  constructor() {}

  @Get()
  async handle() {}
}
