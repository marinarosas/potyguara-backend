import { BadRequestException, Body, Controller, Post, UnauthorizedException, UsePipes } from "@nestjs/common";
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation-pipe";
import { z } from "zod";
import { AuthenticateViewerUseCase } from "@/domain/forum/application/use-cases/authenticate.viewer";
import { ViewerPresenter } from "../presenters/viewer-presenter";
import { WrongCredentialsError } from "@/domain/forum/application/use-cases/errors/wrong-credentials-error";
import { Public } from "@/infra/auth/public";

const authenticateBodySchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

type AuthenticateBodySchema = z.infer<typeof authenticateBodySchema>;

@Controller("/sing-in")
@Public()
export class AuthenticateController {
  constructor(
    private authenticateViewer: AuthenticateViewerUseCase,
  ) {}

  @Post()
  @UsePipes(new ZodValidationPipe(authenticateBodySchema))
  async handle(@Body() body: AuthenticateBodySchema) {
    const { email, password } = body;

    const result = await this.authenticateViewer.execute({
      email,
      password
    })

    if(result.isLeft()){
      const error = result.value

      switch(error.constructor) {
        case WrongCredentialsError:
          throw new UnauthorizedException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }

    const {accessToken, viewer} = result.value
    
    return {
      user: ViewerPresenter.toHTTP(viewer),
      token: accessToken,
    }
}
}