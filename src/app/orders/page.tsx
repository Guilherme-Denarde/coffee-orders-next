"use client";

import React, { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import OrderItem from "@/components/OrderItem";
import { fetchOrders, updateOrderStatus, deleteOrder } from "@/services/api";
import { Order } from "@/types";

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const data = await fetchOrders();
        setOrders(data);
      } catch (error) {
        console.error("Failed to load orders:", error);
        setError("Failed to load orders. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, []);

  const handleStatusChange = async (
    id: string,
    status: "PENDENTE" | "PROCESSANDO" | "ENVIADO" | "CANCELADO"
  ) => {
    try {
      const success = await updateOrderStatus(id, status);
      if (success) {
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.id === id ? { ...order, status } : order
          )
        );
      } else {
        setError("Failed to update order status. Please try again.");
      }
    } catch (error) {
      console.error("Error updating order status:", error);
      setError("An error occurred. Please try again later.");
    }
  };

  const handleDeleteOrder = async (id: string) => {
    if (!confirm("Are you sure you want to delete this order?")) {
      return;
    }

    try {
      const success = await deleteOrder(id);
      if (success) {
        setOrders((prevOrders) => prevOrders.filter((order) => order.id !== id));
      } else {
        setError("Failed to delete order. Please try again.");
      }
    } catch (error) {
      console.error("Error deleting order:", error);
      setError("An error occurred. Please try again later.");
    }
  };

  return (
    <Layout title="Order Management - DFlix Coffee Roasters">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Order Management</h1>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-10">
            <p>Loading orders...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-10 bg-gray-50 rounded-lg">
            <p className="text-gray-500">No orders found</p>
          </div>
        ) : (
          <div>
            {orders.map((order) => (
              <OrderItem
                key={order.id}
                order={order}
                onStatusChange={handleStatusChange}
                onDelete={handleDeleteOrder}
              />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}