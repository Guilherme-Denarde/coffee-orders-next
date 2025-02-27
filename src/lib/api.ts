export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export const fetchPedidos = async () => {
  const res = await fetch(`${API_URL}/pedidos`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}` // Se estiver usando Firebase Auth
    }
  });
  return res.json();
};

export const fetchProdutos = async () => {
  const res = await fetch(`${API_URL}/produtos`);
  return res.json();
};

export const criarProduto = async (produto: any) => {
  const res = await fetch(`${API_URL}/produtos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(produto),
  });
  return res.json();
};
