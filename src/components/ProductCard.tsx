import React from "react";
import Image from "next/image";
import { Product } from "../types";
import { useCart } from "../context/CartContext";

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105">
      <div className="relative h-48 w-full">
        <Image
          src={product.image || "/api/placeholder/300/200"}
          alt={product.name}
          fill
          className="object-contain"
        />
      </div>
      <div className="p-4 text-center">
        <h3 className="text-lg font-semibold text-gray-700">{product.name}</h3>
        <p className="text-gray-600 my-2">R$ {product.price}</p>
        <button
          onClick={() => addToCart(product)}
          className="mt-2 w-full bg-[#b8aa8e] hover:bg-[#a29681] text-white py-2 px-4 rounded transition-colors"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;