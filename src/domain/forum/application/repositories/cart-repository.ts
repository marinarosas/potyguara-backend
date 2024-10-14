import { Cart } from "../../enterprise/entities/cart";

export abstract class CartRepository {
abstract  findById(id: string): Promise<Cart | null>
abstract  create(cart: Cart): Promise<void>
abstract  findByUserId(userId: string): Promise<Cart[]>
}
