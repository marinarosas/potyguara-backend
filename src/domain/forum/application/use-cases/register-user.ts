import { Either, left, right } from "@/core/either";
import { Injectable } from "@nestjs/common";
import { User } from "../../enterprise/entities/user";
import { UserRepository } from "../repositories/user-repository";
import { HashGenerator } from "../cryptography/hash-generator";
import { UserAlreadyExistsError } from "./errors/user-already-exists-error";
import { Role } from "@prisma/client";

interface RegisterUserUseCaseRequest {
  name: string;
  username: string;
  email: string;
  password: string;
  role: Role;
}

type RegisterUserUseCaseResponse = Either<
  UserAlreadyExistsError,
  {
    user: User;
  }
>;

@Injectable()
export class RegisterUserUseCase {
  constructor(
    private userRepository: UserRepository,
    private hashGenerator: HashGenerator
  ) {}

  async execute({
    name,
    username,
    email,
    password,
    role,
  }: RegisterUserUseCaseRequest): Promise<RegisterUserUseCaseResponse> {
    const userWithSameEmail = await this.userRepository.findByEmail(email);

    if (userWithSameEmail) {
      return left(new UserAlreadyExistsError(email))
    }

    const userWithSameUsername = await this.userRepository.findByUsername(username);

    if (userWithSameUsername) {
        return left(new UserAlreadyExistsError(username))
    }

    const hashedPassword = await this.hashGenerator.hash(password);

    const user = User.create({
       name,
       username,
       email,
       password: hashedPassword,
       role, 
    })

    await this.userRepository.create(user)

    return right({
      user,
    });
  }
}
