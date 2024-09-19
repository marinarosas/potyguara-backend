import { BadRequestException, Body, Controller, Post } from "@nestjs/common";
import { CurrentUser } from "@/infra/auth/current-user-decorator";
import { UserPayload } from "@/infra/auth/jwt.strategy";
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation-pipe";
import { z } from "zod";
import { CreateEventUseCase } from "@/domain/forum/application/use-cases/create-event";

const createEventBodySchema = z.object({
  title: z.string(),
  content: z.string(),
  price: z.number(),
  eventDate: z.string(),
  eventTime: z.string(),
  statusPayment: z.boolean(),
  attachments: z.array(z.string().uuid()),
});

type CreateEventBodySchema = z.infer<typeof createEventBodySchema>;

const bodyValidationPipe = new ZodValidationPipe(createEventBodySchema);

@Controller("/events")
export class CreateEventController {
  constructor(private createEvent: CreateEventUseCase) {}

  @Post()
  async handle(
    @Body(bodyValidationPipe) body: CreateEventBodySchema,
    @CurrentUser() user: UserPayload
  ) {
    const { title, content, price, eventDate, eventTime, statusPayment, attachments } = body;
    const userId = user.sub;

   const result =  await this.createEvent.execute({
      authorId: userId,
      title,
      content,
      price,
      eventTime,
      eventDate,
      statusPayment,
      attachmentsIds: attachments,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }
  }
}
