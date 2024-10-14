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
import { Public } from "@/infra/auth/public";
import { RegisterUserUseCase } from "@/domain/forum/application/use-cases/register-user";
import { UserAlreadyExistsError } from "@/domain/forum/application/use-cases/errors/user-already-exists-error";
import { Role } from "@prisma/client";

const createAccountBodySchema = z.object({
  name: z.string(),
  username: z.string(),
  email: z.string().email(),
  password: z.string(),
  role: z.enum([Role.ADMIN, Role.ARTIST, Role.VIEWER]),
});

type CreateAccountBodySchema = z.infer<typeof createAccountBodySchema>

@Controller("/sing-up")
@Public()
export class CreateAccountController {
  constructor(private registerUser: RegisterUserUseCase) {}

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(createAccountBodySchema))
  async handle(@Body() body: CreateAccountBodySchema) {
    const { name, username, email, password, role } = body

   const result =  await this.registerUser.execute({
    name,
    username,
    email,
    password,
    role,
   })

   if(result.isLeft()){
    const error = result.value

    switch(error.constructor) {
      case UserAlreadyExistsError:
        throw new ConflictException(error.message)
      default:
        throw new BadRequestException(error.message)
    }
   }
  }
}
