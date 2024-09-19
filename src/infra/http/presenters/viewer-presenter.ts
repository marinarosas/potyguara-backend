import { Viewer } from "@/domain/forum/enterprise/entities/viewer";

export class ViewerPresenter {
  static toHTTP(viewer: Viewer) {
    return {
      id: viewer.id.toString(),
      name: viewer.name,
      email: viewer.email,
      username: viewer.username,
    };
  }
}
