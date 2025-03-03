"use client";

import React, { useState } from "react";
import Layout from "@/components/Layout";
import CartItem from "@/components/CartItem";
import { useCart } from "@/context/CartContext";
import { createOrder } from "@/services/api";
import { useRouter } from "next/navigation";

export default function Cart() {
  const { items, totalPrice, clearCart } = useCart();
  const router = useRouter();
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    email: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomerInfo({
      ...customerInfo,
      [e.target.name]: e.target.value,
    });
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!customerInfo.name || !customerInfo.email) {
      setError("Please fill in all required fields");
      return;
    }
    
    if (items.length === 0) {
      setError("Your cart is empty");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const orderItems = items.map((item) => ({
        id: item.product.id,
        nome: item.product.name,
        quantidade: item.quantity,
        preco: item.product.price,
      }));

      const order = await createOrder(
        customerInfo.name,
        customerInfo.email,
        orderItems
      );

      if (order) {
        clearCart();
        router.push(`/order/${order.id}`);
      } else {
        setError("Failed to create order. Please try again.");
      }
    } catch (err) {
      setError("An error occurred during checkout. Please try again later.");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout title="Shopping Cart - DFlix Coffee Roasters">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Your Cart</h1>

        {items.length === 0 ? (
          <div className="text-center py-10 bg-gray-50 rounded-lg">
            <p className="text-gray-500">Your cart is empty</p>
            <button
              onClick={() => router.push("/")}
              className="mt-4 bg-[#b8aa8e] hover:bg-[#a29681] text-white py-2 px-4 rounded"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <>
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              {items.map((item) => (
                <CartItem key={item.product.id} item={item} />
              ))}

              <div className="mt-6 flex justify-between border-t pt-4">
                <span className="font-bold">Total:</span>
                <span className="font-bold">R$ {totalPrice.toFixed(2)}</span>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold mb-4">Checkout</h2>

              {error && (
                <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
                  {error}
                </div>
              )}

              <form onSubmit={handleCheckout}>
                <div className="mb-4">
                  <label
                    htmlFor="name"
                    className="block text-gray-700 font-medium mb-2"
                  >
                    Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={customerInfo.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#b8aa8e]"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label
                    htmlFor="email"
                    className="block text-gray-700 font-medium mb-2"
                  >
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={customerInfo.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#b8aa8e]"
                    required
                  />
                </div>

                <div className="flex justify-between mt-6">
                  <button
                    type="button"
                    onClick={() => router.push("/")}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded"
                  >
                    Continue Shopping
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-[#b8aa8e] hover:bg-[#a29681] text-white py-2 px-4 rounded disabled:opacity-50"
                  >
                    {isSubmitting ? "Processing..." : "Place Order"}
                  </button>
                </div>
              </form>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}