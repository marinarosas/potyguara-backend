import { Either, left, right } from "@/core/either";
import { Injectable } from "@nestjs/common";
import { ViewerRepository } from "../repositories/viewer-repository";
import { HashCompare } from "../cryptography/hash-compare";
import { Encrypter } from "../cryptography/encrypter";
import { WrongCredentialsError } from "./errors/wrong-credentials-error";
import { Viewer } from "../../enterprise/entities/viewer";

interface AuthenticateViewerUseCaseRequest {
  email: string;
  password: string;
}

type AuthenticateViewerUseCaseResponse = Either<
  WrongCredentialsError,
  {
    viewer: Viewer
    accessToken: string;
  }
>;

@Injectable()
export class AuthenticateViewerUseCase {
  constructor(
    private viewerRepository: ViewerRepository,
    private hashCompare: HashCompare,
    private encrypter: Encrypter
  ) {}

  async execute({
    email,
    password,
  }: AuthenticateViewerUseCaseRequest): Promise<AuthenticateViewerUseCaseResponse> {
    const viewer = await this.viewerRepository.findByEmail(email);

    if (!viewer) {
      return left(new WrongCredentialsError());
    }

    const isPasswordValid = await this.hashCompare.compare(
      password,
      viewer.password
    );

    if (!isPasswordValid) {
      return left(new WrongCredentialsError());
    }
    const accessToken = await this.encrypter.encrypt({
      sub: viewer.id.toString(),
    });

    return right({
      viewer,
      accessToken,
    });
  }
}
