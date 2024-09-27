import { Either, left, right } from "@/core/either";
import { Injectable } from "@nestjs/common";
import { Viewer } from "../../enterprise/entities/viewer";
import { ViewerRepository } from "../repositories/viewer-repository";
import { HashGenerator } from "../cryptography/hash-generator";
import { ViewerAlreadyExistsError } from "./errors/viewer-already-exists-error";
import { Role } from "@prisma/client";

interface RegisterViewerUseCaseRequest {
  name: string;
  username: string;
  email: string;
  password: string;
  role: Role;
}

type RegisterViewerUseCaseResponse = Either<
  ViewerAlreadyExistsError,
  {
    viewer: Viewer;
  }
>;

@Injectable()
export class RegisterViewerUseCase {
  constructor(
    private viewerRepository: ViewerRepository,
    private hashGenerator: HashGenerator
  ) {}

  async execute({
    name,
    username,
    email,
    password,
    role,
  }: RegisterViewerUseCaseRequest): Promise<RegisterViewerUseCaseResponse> {
    const viewerWithSameEmail = await this.viewerRepository.findByEmail(email);

    if (viewerWithSameEmail) {
      return left(new ViewerAlreadyExistsError(email))
    }

    const viewerWithSameUsername = await this.viewerRepository.findByUsername(username);

    if (viewerWithSameUsername) {
        return left(new ViewerAlreadyExistsError(username))
    }

    const hashedPassword = await this.hashGenerator.hash(password);

    const viewer = Viewer.create({
       name,
       username,
       email,
       password: hashedPassword,
       role, 
    })

    await this.viewerRepository.create(viewer)

    return right({
      viewer,
    });
  }
}
