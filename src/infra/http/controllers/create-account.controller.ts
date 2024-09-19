import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Post,
  UsePipes,
} from "@nestjs/common";
import { z } from "zod";
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation-pipe";
import { RegisterViewerUseCase } from "@/domain/forum/application/use-cases/register-viewer";
import { ViewerAlreadyExistsError } from "@/domain/forum/application/use-cases/errors/viewer-already-exists-error";
import { Public } from "@/infra/auth/public";

const createAccountBodySchema = z.object({
  name: z.string(),
  username: z.string(),
  email: z.string().email(),
  password: z.string(),
});

type CreateAccountBodySchema = z.infer<typeof createAccountBodySchema>

@Controller("/sing-up")
@Public()
export class CreateAccountController {
  constructor(private registerViewer: RegisterViewerUseCase) {}

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(createAccountBodySchema))
  async handle(@Body() body: CreateAccountBodySchema) {
    const { name, username, email, password } = body

   const result =  await this.registerViewer.execute({
    name,
    username,
    email,
    password
   })

   if(result.isLeft()){
    const error = result.value

    switch(error.constructor) {
      case ViewerAlreadyExistsError:
        throw new ConflictException(error.message)
      default:
        throw new BadRequestException(error.message)
    }
   }
  }
}
