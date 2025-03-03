"use client";

import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import ProductCard from "../components/ProductCard";
import CategoryFilter from "../components/CategoryFilter";
import { mockProducts } from "../services/api";
import { Product } from "../types";

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("All");

  useEffect(() => {
    const loadProducts = async () => {
      try {
        // When endpoint is ready, use fetchProducts()
        // For now, use mockProducts
        const data = mockProducts;
        setProducts(data);

        // Extract unique categories
        const uniqueCategories = Array.from(
          new Set(data.map((product) => product.category))
        );
        setCategories(["All", ...uniqueCategories]);
      } catch (error) {
        console.error("Failed to load products:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  const filteredProducts =
    activeCategory === "All"
      ? products
      : products.filter((product) => product.category === activeCategory);

  return (
    <Layout title="DFlix Coffee Roasters - Menu">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-semibold text-[#8c7960] mb-4">
          Welcome to DFlix Coffee Roasters
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Discover our exquisite range of specialty coffees, carefully sourced
          and roasted to perfection.
        </p>
      </div>

      <CategoryFilter
        categories={categories}
        activeCategory={activeCategory}
        onSelectCategory={setActiveCategory}
      />

      {loading ? (
        <div className="text-center py-10">
          <p>Loading products...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </Layout>
  );
}