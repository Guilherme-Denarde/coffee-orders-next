import type { Product, Order } from '@/types/index';

const API_URL = process.env.NEXT_PUBLIC_API_URL;// || "http://https://coffee-orders-43801498060.us-central1.run.app:8080";

export const fetchProducts = async (): Promise<Product[]> => {
  try {
    // Note: Mocking products until the endpoint is created
    return mockProducts;
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
};

export const createOrder = async (
  clientName: string,
  email: string,
  items: { id: string; nome: string; quantidade: number; preco: number }[]
): Promise<Order | null> => {
  try {
    const response = await fetch(`${API_URL}/pedidos`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        cliente: clientName,
        email: email,
        itens: items,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to create order");
    }

    return await response.json();
  } catch (error) {
    console.error("Error creating order:", error);
    return null;
  }
};

export const fetchOrders = async (): Promise<Order[]> => {
  try {
    const response = await fetch(`${API_URL}/pedidos`);
    if (!response.ok) {
      throw new Error("Failed to fetch orders");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching orders:", error);
    return [];
  }
};

export const fetchOrderById = async (id: string): Promise<Order | null> => {
  try {
    const response = await fetch(`${API_URL}/pedidos/${id}`);
    if (!response.ok) {
      throw new Error("Failed to fetch order");
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching order ${id}:`, error);
    return null;
  }
};

export const updateOrderStatus = async (
  id: string,
  status: "PENDENTE" | "PROCESSANDO" | "ENVIADO" | "CANCELADO"
): Promise<boolean> => {
  try {
    const response = await fetch(`${API_URL}/pedidos/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    });

    return response.ok;
  } catch (error) {
    console.error(`Error updating order ${id}:`, error);
    return false;
  }
};

export const deleteOrder = async (id: string): Promise<boolean> => {
  try {
    const response = await fetch(`${API_URL}/pedidos/${id}`, {
      method: "DELETE",
    });
    return response.status === 204;
  } catch (error) {
    console.error(`Error deleting order ${id}:`, error);
    return false;
  }
};

export const mockProducts: Product[] = [
    {
      id: "1",
      name: "Espresso",
      price: 6,
      image: "/images/espresso.jpg",
      category: "Hot Coffees",
      description: "Pure coffee essence in a small cup"
    },
    {
      id: "2",
      name: "Espresso Duplo",
      price: 8,
      image: "/images/espresso-duplo.jpg",
      category: "Hot Coffees",
      description: "Double shot of espresso for coffee lovers"
    },
    {
      id: "3",
      name: "Espresso Macchiato",
      price: 9,
      image: "/images/macchiato.jpg",
      category: "Hot Coffees",
      description: "Espresso with a dollop of foamed milk"
    },
    {
      id: "4",
      name: "Americano",
      price: 9,
      image: "/images/americano.jpg",
      category: "Hot Coffees",
      description: "Espresso diluted with hot water"
    },
    {
      id: "5",
      name: "Cappuccino",
      price: 12,
      image: "/images/cappuccino.jpg",
      category: "Hot Coffees",
      description: "Equal parts espresso, steamed milk, and foam"
    },
    {
      id: "6",
      name: "Latte",
      price: 11,
      image: "/images/latte.jpg",
      category: "Hot Coffees",
      description: "Espresso with steamed milk and a light layer of foam"
    },
    {
      id: "7",
      name: "Iced Coffee",
      price: 10,
      image: "/images/iced-coffee.jpg",
      category: "Iced Coffees",
      description: "Chilled coffee served over ice"
    },
    {
      id: "8",
      name: "Cold Brew",
      price: 12,
      image: "/images/cold-brew.jpg",
      category: "Cold Brew",
      description: "Smooth, cold-steeped coffee brewed for 12+ hours"
    }
  ];