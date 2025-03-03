"use client";

import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, serverTimestamp, Timestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import Layout from "@/components/Layout";
import { db, storage } from "@/lib/firebase";
import { Product } from "@/types";

const ProductManagement = () => {
  // Typed state for products
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Fields for the form
  const [formData, setFormData] = useState<{
    name: string;
    description: string;
    price: string;
    imageUrl: string;
    category: string;
    inStock: boolean;
  }>({
    name: "",
    description: "",
    price: "",
    imageUrl: "",
    category: "coffee",
    inStock: true,
  });

  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  // Fetch products on mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productsCollection = collection(db, "products");
        const snapshot = await getDocs(productsCollection);
        const fetchedProducts: Product[] = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            name: data.name,
            description: data.description,
            price: data.price,
            category: data.category,
            imageUrl: data.imageUrl,
            inStock: data.inStock,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt,
          };
        });
        setProducts(fetchedProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Handle form inputs
  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Handle file input
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      imageUrl: "",
      category: "coffee",
      inStock: true,
    });
    setImageFile(null);
    setIsEditing(false);
    setCurrentId(null);
  };

  // Submit (Create or Update)
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const priceNum = parseFloat(formData.price);
      if (isNaN(priceNum)) {
        throw new Error("Invalid price value");
      }

      const productData: Partial<Product> = {
        name: formData.name,
        description: formData.description,
        price: priceNum,
        category: formData.category,
        inStock: formData.inStock,
        updatedAt: serverTimestamp() as Timestamp,
      };

      // Upload image if new one is selected
      if (imageFile) {
        const storageRef = ref(storage, `products/${Date.now()}_${imageFile.name}`);
        await uploadBytes(storageRef, imageFile);
        const url = await getDownloadURL(storageRef);
        productData.imageUrl = url;
      } else if (formData.imageUrl) {
        // Keep existing image URL if no new file is selected
        productData.imageUrl = formData.imageUrl;
      }

      const productsRef = collection(db, "products");

      if (isEditing && currentId) {
        // Update existing product
        const productDoc = doc(db, "products", currentId);
        await updateDoc(productDoc, productData);

        // Update local state
        setProducts((prev) =>
          prev.map((product) =>
            product.id === currentId
              ? { ...product, ...productData }
              : product
          )
        );
      } else {
        // Adding a new product
        productData.createdAt = serverTimestamp() as Timestamp;
        const docRef = await addDoc(productsRef, productData);

        setProducts((prev) => [
          ...prev,
          { id: docRef.id, ...productData } as Product,
        ]);
      }

      resetForm();
    } catch (error) {
      console.error("Error saving product:", error);
      alert("There was an error saving the product. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Edit product
  const handleEdit = (product: Product) => {
    setFormData({
      name: product.name,
      description: product.description || "",
      price: product.price.toString(),
      imageUrl: product.imageUrl || "",
      category: product.category || "coffee",
      inStock: product.inStock !== false,
    });
    setImageFile(null);
    setIsEditing(true);
    setCurrentId(product.id);
  };

  // Delete product
  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        setLoading(true);
        const productDoc = doc(db, "products", id);
        await deleteDoc(productDoc);
        setProducts((prev) => prev.filter((prod) => prod.id !== id));
      } catch (error) {
        console.error("Error deleting product:", error);
        alert("There was an error deleting the product. Please try again.");
      } finally {
        setLoading(false);
      }
    }
  };

  if (loading && products.length === 0) {
    return <div className="container mx-auto p-4 text-center">Loading...</div>;
  }

  return (
    <Layout title="DFlix Coffee Roasters - Menu">
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Product Management</h1>
      <div className="grid md:grid-cols-3 gap-6">
        {/* Form column */}
        <div className="md:col-span-1">
          <div className="bg-white p-4 rounded shadow">
            <h2 className="text-xl font-semibold mb-4">
              {isEditing ? "Edit Product" : "Add New Product"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name */}
              <div>
                <label htmlFor="name" className="block mb-1">
                  Product Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full p-2 border rounded"
                />
              </div>
              {/* Description */}
              <div>
                <label htmlFor="description" className="block mb-1">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full p-2 border rounded"
                ></textarea>
              </div>
              {/* Price */}
              <div>
                <label htmlFor="price" className="block mb-1">
                  Price ($) *
                </label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  step="0.01"
                  min="0"
                  required
                  className="w-full p-2 border rounded"
                />
              </div>
              {/* Category */}
              <div>
                <label htmlFor="category" className="block mb-1">
                  Category
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                >
                  <option value="coffee">Coffee</option>
                  <option value="equipment">Equipment</option>
                  <option value="accessories">Accessories</option>
                  <option value="gifts">Gifts</option>
                </select>
              </div>
              {/* Image File */}
              <div>
                <label htmlFor="image" className="block mb-1">
                  Product Image
                </label>
                <input
                  type="file"
                  id="image"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full p-2 border rounded"
                />
                {formData.imageUrl && !imageFile && (
                  <div className="mt-2">
                    <img
                      src={formData.imageUrl}
                      alt="Current product"
                      className="h-24 object-contain"
                    />
                    <p className="text-sm text-gray-500">Current image</p>
                  </div>
                )}
              </div>
              {/* In Stock */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="inStock"
                  name="inStock"
                  checked={formData.inStock}
                  onChange={handleInputChange}
                  className="mr-2"
                />
                <label htmlFor="inStock">In Stock</label>
              </div>
              {/* Buttons */}
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="bg-[#b8aa8e] text-white px-4 py-2 rounded"
                  disabled={loading}
                >
                  {isEditing ? "Update Product" : "Add Product"}
                </button>
                {isEditing && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="bg-gray-300 text-gray-800 px-4 py-2 rounded"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
        {/* Products Table */}
        <div className="md:col-span-2">
          <div className="bg-white p-4 rounded shadow">
            <h2 className="text-xl font-semibold mb-4">Products List</h2>
            {products.length === 0 ? (
              <p>No products available. Add your first product!</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Product
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Price
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {products.map((product) => (
                      <tr key={product.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {product.imageUrl && (
                              <img
                                src={product.imageUrl}
                                alt={product.name}
                                className="h-10 w-10 object-cover mr-3"
                              />
                            )}
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {product.name}
                              </div>
                              {product.description && (
                                <div className="text-sm text-gray-500 truncate max-w-xs">
                                  {product.description}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          ${product.price.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100">
                            {product.category ?? "coffee"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              product.inStock !== false
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {product.inStock !== false ? "In Stock" : "Out of Stock"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => handleEdit(product)}
                            className="text-indigo-600 hover:text-indigo-900 mr-3"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(product.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
    </Layout>
  );
};

export default ProductManagement;