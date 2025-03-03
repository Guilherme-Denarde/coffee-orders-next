import React from "react";
import { Order } from "../types";
import { format } from "date-fns";
import { FaEye, FaTrash } from "react-icons/fa";
import Link from "next/link";

interface OrderItemProps {
  order: Order;
  onStatusChange: (id: string, status: "PENDENTE" | "PROCESSANDO" | "ENVIADO" | "CANCELADO") => void;
  onDelete: (id: string) => void;
}

const OrderItem: React.FC<OrderItemProps> = ({ order, onStatusChange, onDelete }) => {
  const formattedDate = (() => {
    try {
      return format(new Date(order.data_criacao), "PPP");
    } catch (error) {
      console.error("Error formatting date:", error);
      return order.data_criacao;
    }
  })();

  const statusBgColor = {
    PENDENTE: "bg-yellow-100 text-yellow-800",
    PROCESSANDO: "bg-blue-100 text-blue-800",
    ENVIADO: "bg-green-100 text-green-800",
    CANCELADO: "bg-red-100 text-red-800",
  };

  return (
    <div className="border rounded-lg p-4 mb-4 bg-white shadow-sm">
      <div className="md:flex md:justify-between">
        <div>
          <h3 className="font-medium text-lg">Order #{order.id.substring(0, 8)}</h3>
          <p className="text-gray-600">
            {order.cliente} - {order.email}
          </p>
          <p className="text-gray-500 text-sm">{formattedDate}</p>
        </div>
        <div className="mt-2 md:mt-0 md:text-right">
          <div className="flex items-center md:justify-end">
            <p className="font-bold mr-2">R$ {order.total.toFixed(2)}</p>
            <span
              className={`px-2 py-1 rounded-full text-xs ${
                statusBgColor[order.status]
              }`}
            >
              {order.status}
            </span>
          </div>
          <div className="mt-2 flex space-x-2 md:justify-end">
            <select
              value={order.status}
              onChange={(e) =>
                onStatusChange(
                  order.id,
                  e.target.value as "PENDENTE" | "PROCESSANDO" | "ENVIADO" | "CANCELADO"
                )
              }
              className="text-sm border rounded px-2 py-1"
            >
              <option value="PENDENTE">PENDENTE</option>
              <option value="PROCESSANDO">PROCESSANDO</option>
              <option value="ENVIADO">ENVIADO</option>
              <option value="CANCELADO">CANCELADO</option>
            </select>
            <Link href={`/order/${order.id}`} passHref>
              <button className="p-1 bg-blue-500 text-white rounded hover:bg-blue-600">
                <FaEye size={16} />
              </button>
            </Link>
            <button
              onClick={() => onDelete(order.id)}
              className="p-1 bg-red-500 text-white rounded hover:bg-red-600"
            >
              <FaTrash size={16} />
            </button>
          </div>
        </div>
      </div>
      <div className="mt-3">
        <h4 className="text-sm font-medium text-gray-700">Items:</h4>
        <div className="text-sm text-gray-600">
          {order.itens.map((item, index) => (
            <div key={index} className="flex justify-between">
              <span>
                {item.quantidade}x {item.nome}
              </span>
              <span>R$ {(item.preco * item.quantidade).toFixed(2)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrderItem;