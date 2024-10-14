import { Entity } from "@/core/entities/entity";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Product } from "./product";

export interface CategoryProps {
  name: string;
  products: Product[];
  createdAt: Date;
  updatedAt: Date;
}

export class Category extends Entity<CategoryProps> {
  get name() {
    return this.props.name;
  }

  get products() {
    return this.props.products;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  static create(props: CategoryProps, id?: UniqueEntityID) {
    const category = new Category(props, id);

    return category;
  }
}
