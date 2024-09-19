import { UseCaseError } from "@/core/errors/use-case-error";

export class ViewerAlreadyExistsError extends Error implements UseCaseError {
    constructor(identifier: string){
        super(`Viewer "${identifier}" already exists.`)
    }
}