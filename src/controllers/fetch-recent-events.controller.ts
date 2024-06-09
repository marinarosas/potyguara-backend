import { Controller, Get, Query, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { ZodValidationPipe } from "src/pipes/zod-validation-pipe";
import { PrismaService } from "src/prisma/prisma.service";
import { z } from "zod";

const pageQueryParamSchema = z
  .string()
  .optional()
  .default("1")
  .transform(Number)
  .pipe(z.number().min(1));

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema);

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>;

@Controller("/events")
@UseGuards(JwtAuthGuard)
export class FetchRecentEventsController {
  constructor(private prisma: PrismaService) {}

  @Get()
  async handle(@Query("page", queryValidationPipe) page: PageQueryParamSchema) {
    const perpage = 15

    const events = await this.prisma.event.findMany({
        take: perpage,
        skip: (page - 1) * perpage,
      orderBy: {
        createdAt: "desc",
      },
    });

    return { events };
  }
}
