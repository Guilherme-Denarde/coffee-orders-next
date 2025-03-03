import { Timestamp } from "firebase/firestore";

export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  category?: string;
  imageUrl?: string;
  inStock?: boolean;
  image?: string;
  createdAt?: Timestamp | null;  
  updatedAt?: Timestamp | null;
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