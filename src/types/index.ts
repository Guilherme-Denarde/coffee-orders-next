export interface Product {
    id: string;
    name: string;
    price: number;
    image: string;
    description?: string;
    category: string;
  }
  
  export interface CartItem {
    product: Product;
    quantity: number;
  }
  
  export interface Order {
    id: string;
    cliente: string;
    email: string;
    itens: {
      id: string;
      nome: string;
      quantidade: number;
      preco: number;
    }[];
    total: number;
    status: "PENDENTE" | "PROCESSANDO" | "ENVIADO" | "CANCELADO";
    data_criacao: string;
    data_atualizacao: string;
  }