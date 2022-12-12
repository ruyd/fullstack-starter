import { Cart } from '@shared/lib'
import { DataTypes } from 'sequelize'
import { addModel } from 'src/shared/db'

export const CartAttributes = {
  cartId: {
    primaryKey: true,
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
  },
  userId: {
    type: DataTypes.UUID,
  },
  drawingId: {
    type: DataTypes.UUID,
  },
  quantity: {
    type: DataTypes.INTEGER,
  },
}

export const CartModel = addModel<Cart>('cart', CartAttributes)

export default CartModel