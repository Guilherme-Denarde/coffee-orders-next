"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "@/lib/firebase";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const produtoSchema = z.object({
  nome: z.string().nonempty("Nome é obrigatório"),
  preco: z.number().positive("Preço deve ser positivo"),
  imagem: z.any().optional(),
});

type produtoFormData = z.infer<typeof produtoSchema>;

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://https://coffee-orders-43801498060.us-central1.run.app:8080";

export default function ProdutoForm() {
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<produtoFormData>({
    resolver: zodResolver(produtoSchema),
    defaultValues: { nome: "", preco: 0 },
  });

  const mutation = useMutation({
    mutationFn: async (data: produtoFormData) => {
      // Se tiver imagem, fazer upload no Firebase Storage
      let imageUrl = "";
      if (data.imagem && data.imagem.length > 0) {
        const file = data.imagem[0];
        const storageRef = ref(storage, `produtos/${file.name}`);
        await uploadBytes(storageRef, file);
        imageUrl = await getDownloadURL(storageRef);
      }

      // Criar produto no backend
      const res = await fetch(`${API_URL}/produtos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, imagem: imageUrl }),
      });
      if (!res.ok) {
        throw new Error("Erro ao criar produto");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["produtos"] });
      alert("Produto criado com sucesso!");
    },
    onError: (error: unknown) => {
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert("Ocorreu um erro inesperado");
      }
    },
  });

  const onSubmit = (data: produtoFormData) => {
    mutation.mutate(data);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-gray-100 p-4 rounded flex flex-col gap-3"
    >
      <input
        type="text"
        placeholder="Nome do Produto"
        {...register("nome")}
        className="border p-2 rounded"
      />
      {errors.nome && <p className="text-red-500">{errors.nome.message}</p>}

      <input
        type="number"
        step="0.01"
        placeholder="Preço"
        {...register("preco", { valueAsNumber: true })}
        className="border p-2 rounded"
      />
      {errors.preco && <p className="text-red-500">{errors.preco.message}</p>}

      <input type="file" {...register("imagem")} />
      <button
        type="submit"
        disabled={mutation.isPending}
        className="bg-blue-600 text-white p-2 rounded">
        {mutation.isPending ? "Enviando..." : "Criar Produto"}
    </button>
    </form>
  );
}
