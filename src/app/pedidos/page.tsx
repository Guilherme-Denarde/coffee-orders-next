"use client";

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function PedidosPage() {
  const [error, setError] = useState<string | null>(null);

  const { data: pedidos, isLoading, refetch } = useQuery({
    queryKey: ["pedidos"],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/pedidos`, {
        headers: {
          Authorization: "Bearer SEU_TOKEN_FIREBASE" // se estiver usando Auth
        }
      });
      if (!res.ok) {
        throw new Error("Erro ao buscar pedidos");
      }
      return res.json();
    },
  });

  if (isLoading) return <p>Carregando...</p>;
  if (error) return <p>Erro: {error}</p>;

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">Lista de Pedidos</h1>
      <button
        onClick={() => refetch()}
        className="bg-blue-500 text-white px-3 py-1 my-2 rounded"
      >
        Atualizar
      </button>
      <ul className="space-y-4">
        {pedidos?.map((pedido: any) => (
          <li key={pedido.id} className="border p-4 rounded">
            <div className="font-semibold">{pedido.cliente}</div>
            <div>Status: {pedido.status}</div>
            <div>Total: R${pedido.total}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
