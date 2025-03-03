import React from "react";
import Image from "next/image";
import { CartItem as CartItemType } from "../types";
import { useCart } from "../context/CartContext";
import { FaTrash, FaMinus, FaPlus } from "react-icons/fa";

interface CartItemProps {
  item: CartItemType;
}

const CartItem: React.FC<CartItemProps> = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();
  const { product, quantity } = item;

  return (
    <div className="flex items-center border-b py-4">
      <div className="relative h-16 w-16 flex-shrink-0">
        <Image
          src={product.image || "/api/placeholder/300/200"}
          alt={product.name}
          fill
          className="object-contain"
        />
      </div>
      <div className="ml-4 flex-grow">
        <h3 className="font-medium">{product.name}</h3>
        <p className="text-gray-600">R$ {product.price}</p>
      </div>
      <div className="flex items-center">
        <button
          onClick={() => updateQuantity(product.id, quantity - 1)}
          className="p-1 text-gray-500 hover:text-black"
        >
          <FaMinus size={14} />
        </button>
        <span className="mx-2 w-8 text-center">{quantity}</span>
        <button
          onClick={() => updateQuantity(product.id, quantity + 1)}
          className="p-1 text-gray-500 hover:text-black"
        >
          <FaPlus size={14} />
        </button>
      </div>
      <div className="ml-4 text-right">
        <p className="font-medium">R$ {(product.price * quantity).toFixed(2)}</p>
        <button
          onClick={() => removeFromCart(product.id)}
          className="text-red-500 hover:text-red-700 mt-1"
        >
          <FaTrash size={16} />
        </button>
      </div>
    </div>
  );
};

export default CartItem;