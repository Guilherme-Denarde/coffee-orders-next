"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Layout from "@/components/Layout";
import { fetchOrderById, updateOrderStatus } from "@/services/api";
import { Order } from "@/types";
import Link from "next/link";
import { format } from "date-fns";

export default function OrderDetails() {
  const router = useRouter();
  const { id } = router.query;
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [status, setStatus] = useState<"PENDENTE" | "PROCESSANDO" | "ENVIADO" | "CANCELADO">();
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const loadOrder = async () => {
      if (!id) return;

      try {
        const data = await fetchOrderById(id as string);
        if (data) {
          setOrder(data);
          setStatus(data.status);
        } else {
          setError("Order not found");
        }
      } catch (error) {
        console.error("Failed to load order:", error);
        setError("Failed to load order details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    loadOrder();
  }, [id]);

  const handleStatusUpdate = async () => {
    if (!order || !status) return;

    setUpdating(true);
    try {
      const success = await updateOrderStatus(order.id, status);
      if (success) {
        setOrder({ ...order, status });
      } else {
        setError("Failed to update order status. Please try again.");
      }
    } catch (error) {
      console.error("Error updating order status:", error);
      setError("An error occurred. Please try again later.");
    } finally {
      setUpdating(false);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "PPP 'at' pp");
    } catch (error) {
      console.error("Error formatting date:", error);
      return dateString;
    }
  };  

  const statusColors = {
    PENDENTE: "bg-yellow-100 text-yellow-800",
    PROCESSANDO: "bg-blue-100 text-blue-800",
    ENVIADO: "bg-green-100 text-green-800",
    CANCELADO: "bg-red-100 text-red-800",
  };

  if (loading) {
    return (
      <Layout title="Order Details - DFlix Coffee Roasters">
        <div className="text-center py-10">
          <p>Loading order details...</p>
        </div>
      </Layout>
    );
  }

  if (error || !order) {
    return (
      <Layout title="Order Details - DFlix Coffee Roasters">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-100 text-red-700 p-4 rounded mb-4">
            {error || "Order not found"}
          </div>
          <Link href="/orders" className="text-[#b8aa8e] hover:underline">
            ← Back to Orders
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title={`Order #${order.id.substring(0, 8)} - DFlix Coffee Roasters`}>
      <div className="max-w-4xl mx-auto">
        <div className="mb-4">
          <Link href="/orders" className="text-[#b8aa8e] hover:underline">
            ← Back to Orders
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex justify-between items-start border-b pb-4 mb-4">
            <div>
              <h1 className="text-2xl font-bold">
                Order #{order.id.substring(0, 8)}
              </h1>
              <p className="text-gray-600 mt-1">
                Placed on {formatDate(order.data_criacao)}
              </p>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-sm ${
                statusColors[order.status]
              }`}
            >
              {order.status}
            </span>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <h2 className="text-lg font-semibold mb-2">Customer Information</h2>
              <p>
                <span className="font-medium">Name:</span> {order.cliente}
              </p>
              <p>
                <span className="font-medium">Email:</span> {order.email}
              </p>
            </div>
            <div>
              <h2 className="text-lg font-semibold mb-2">Order Summary</h2>
              <p>
                <span className="font-medium">Total:</span> R${" "}
                {order.total.toFixed(2)}
              </p>
              <p>
                <span className="font-medium">Last Updated:</span>{" "}
                {formatDate(order.data_atualizacao)}
              </p>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-3">Order Items</h2>
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2">Item</th>
                    <th className="px-4 py-2">Price</th>
                    <th className="px-4 py-2">Quantity</th>
                    <th className="px-4 py-2">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {order.itens.map((item, index) => (
                    <tr key={index}>
                      <td className="px-4 py-3">{item.nome}</td>
                      <td className="px-4 py-3">R$ {item.preco.toFixed(2)}</td>
                      <td className="px-4 py-3">{item.quantidade}</td>
                      <td className="px-4 py-3">
                        R$ {(item.preco * item.quantidade).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-gray-50">
                  <tr>
                    <td
                      colSpan={3}
                      className="px-4 py-3 text-right font-semibold"
                    >
                      Total
                    </td>
                    <td className="px-4 py-3 font-semibold">
                      R$ {order.total.toFixed(2)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          <div className="border-t pt-4">
            <h2 className="text-lg font-semibold mb-3">Update Status</h2>
            <div className="flex items-center">
              <select
                value={status}
                onChange={(e) =>
                  setStatus(
                    e.target.value as "PENDENTE" | "PROCESSANDO" | "ENVIADO" | "CANCELADO"
                  )
                }
                className="border rounded px-3 py-2 mr-3"
              >
                <option value="PENDENTE">PENDENTE</option>
                <option value="PROCESSANDO">PROCESSANDO</option>
                <option value="ENVIADO">ENVIADO</option>
                <option value="CANCELADO">CANCELADO</option>
              </select>
              <button
                onClick={handleStatusUpdate}
                disabled={updating || status === order.status}
                className="bg-[#b8aa8e] hover:bg-[#a29681] text-white py-2 px-4 rounded disabled:opacity-50"
              >
                {updating ? "Updating..." : "Update Status"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}