import { UseCaseError } from "@/core/errors/use-case-error";

export class ArtistAlreadyExistsError extends Error implements UseCaseError {
    constructor(identifier: string){
        super(`Artist "${identifier}" already exists.`)
    }
}