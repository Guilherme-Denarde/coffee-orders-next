"use client";

import { useQuery } from "@tanstack/react-query";
import ProdutoForm from "@/components/ProdutoFrom";
import { Product } from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

async function fetchProdutos(): Promise<Product[]> {
  const res = await fetch(`${API_URL}/produtos`);
  if (!res.ok) {
    throw new Error("Erro ao listar produtos");
  }
  return res.json();
}

export default function ProdutosPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["produtos"],
    queryFn: fetchProdutos,
  });

  if (isLoading) return <p>Carregando...</p>;
  if (error) return <p>Erro ao carregar produtos</p>;

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">CRUD de Produtos</h1>
      <ProdutoForm />
      <ul className="space-y-4">
        {data?.map((prod: Product) => (
          <li key={prod.id} className="border p-4 rounded shadow">
            <p className="font-semibold">{prod.name}</p>
            <p>R$ {Number(prod.price).toFixed(2)}</p>
            {prod.image && (
              <img
                src={prod.image}
                alt={prod.name}
                className="w-32 h-32 object-cover mt-2"
              />
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
