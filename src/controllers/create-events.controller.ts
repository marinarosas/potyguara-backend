import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { CurrentUser } from "src/auth/current-user-decorator";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { UserPayload } from "src/auth/jwt.strategy";
import { ZodValidationPipe } from "src/pipes/zod-validation-pipe";
import { PrismaService } from "src/prisma/prisma.service";
import { z } from "zod";

const createEventBodySchema = z.object({
  title: z.string(),
  content: z.string(),
  price: z.number(),
  eventDate: z.string(),
  eventTime: z.string(),
  statusPayment: z.boolean(),
});

type CreateEventBodySchema = z.infer<typeof createEventBodySchema>;

const bodyValidationPipe = new ZodValidationPipe(createEventBodySchema);

@Controller("/events")
@UseGuards(JwtAuthGuard)
export class CreateEventController {
  constructor(private prisma: PrismaService) {}

  @Post()
  async handle(
    @Body(bodyValidationPipe) body: CreateEventBodySchema,
    @CurrentUser() user: UserPayload
  ) {
    const { title, content, price, eventDate, eventTime, statusPayment } = body;
    const userId = user.sub;

    const slug = this.convertToSlug(title);

    await this.prisma.event.create({
      data: {
        authorId: userId,
        title,
        content,
        price,
        eventTime,
        eventDate,
        slug,
        statusPayment,
      },
    });
  }

  private convertToSlug(title: string): string {
    return title
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-");
  }
}
