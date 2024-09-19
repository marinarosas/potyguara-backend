import { Viewer } from '../../enterprise/entities/viewer'

export abstract class ViewerRepository {
abstract  findByEmail(email: string): Promise<Viewer | null>
abstract  findByUsername(username: string): Promise<Viewer | null>
abstract  create(viewer: Viewer): Promise<void>
}
