import { Cart } from '../../enterprise/entities/cart';
import { CartProducts } from '../../enterprise/entities/cart-products';
import { User } from '../../enterprise/entities/user';

export abstract class CartRepository {
abstract  findById(id: string): Promise<Cart | null>
abstract  create(cart: Cart): Promise<void>
abstract  findByUserId(userId: string): Promise<Cart[]>
abstract  findProductsListByCartId(cartId: string): Promise<CartProducts[]>
abstract  findUserByCartId(cartId: string): Promise<User>
}
