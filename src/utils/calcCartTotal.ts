
import { CartItem, Product } from '@prisma/client'

type CartItemWithProduct = CartItem & { product: Product }

export const calcCartTotal = (items: CartItemWithProduct[]) => {
  return items.reduce((acc, item) => {
    return acc + item.product.price * item.quantity
  }, 0)
}
