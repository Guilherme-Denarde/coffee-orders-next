// src/app/cart/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { withAuth } from "../../context/AuthContext";

interface FormData {
  name: string;
  email: string;
  address: string;
  city: string;
  zipCode: string;
  phone: string;
}

const CheckoutPage = () => {
  const { user } = useAuth();
  const { items, totalPrice, clearCart } = useCart();
  const router = useRouter();
  
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    address: "",
    city: "",
    zipCode: "",
    phone: ""
  });
  
  // Pre-fill form with user data if available
  useEffect(() => {
    if (user) {
      setFormData(prevState => ({
        ...prevState,
        name: user.displayName || "",
        email: user.email || ""
      }));
    }
  }, [user]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email) {
      alert("Name and email are required!");
      return;
    }
    
    try {
      // Here you would submit the order to your backend
      // For this example, we'll just simulate it
      
      // Sample order data
      const orderData = {
        userId: user?.uid || "guest",
        customerInfo: {
          name: formData.name,
          email: formData.email,
          address: formData.address,
          city: formData.city,
          zipCode: formData.zipCode,
          phone: formData.phone
        },
        items: items,
        totalPrice: totalPrice,
        status: "pending",
        createdAt: new Date()
      };
      
      // In a real app, you would save this to your database
      console.log("Order placed:", orderData);
      
      // Clear cart and redirect to confirmation page
      clearCart();
      router.push("/order-confirmation");
    } catch (error) {
      console.error("Error placing order", error);
      alert("There was an error placing your order. Please try again.");
    }
  };
  
  // If cart is empty, redirect to products page
  if (items.length === 0) {
    return (
      <div className="container mx-auto p-4 text-center">
        <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
        <p className="mb-4">Add some products to your cart before checking out.</p>
        <button
          onClick={() => router.push("/products")}
          className="bg-[#b8aa8e] text-white px-4 py-2 rounded"
        >
          Browse Products
        </button>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>
      
      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-1/2">
          <h2 className="text-xl font-semibold mb-4">Your Information</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block mb-1">
                Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded"
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block mb-1">
                Email *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded"
              />
            </div>
            
            <div>
              <label htmlFor="address" className="block mb-1">
                Delivery Address
              </label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>
            
            <div className="flex gap-4">
              <div className="w-1/2">
                <label htmlFor="city" className="block mb-1">
                  City
                </label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              
              <div className="w-1/2">
                <label htmlFor="zipCode" className="block mb-1">
                  ZIP Code
                </label>
                <input
                  type="text"
                  id="zipCode"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="phone" className="block mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>
            
            <button
              type="submit"
              className="bg-[#b8aa8e] text-white px-6 py-2 rounded w-full mt-6"
            >
              Place Order
            </button>
          </form>
        </div>
        
        <div className="md:w-1/2">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
          <div className="border rounded p-4">
            {items.map((item) => (
              <div key={item.product.id} className="flex justify-between py-2 border-b">
                <div>
                  <span className="font-medium">{item.product.name}</span>
                  <span className="text-sm text-gray-500 ml-2">x{item.quantity}</span>
                </div>
                <span>${(item.product.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            
            <div className="flex justify-between py-4 font-bold">
              <span>Total</span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Use client-side protection
export default withAuth(CheckoutPage);