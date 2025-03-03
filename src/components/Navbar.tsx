import React, { useState } from "react";
import Link from "next/link";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { FaShoppingCart, FaBars, FaTimes, FaUser, FaSignOutAlt } from "react-icons/fa";

const Navbar = () => {
  const { totalItems } = useCart();
  const { user, signInWithGoogle, signOut } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  
  return (
    <nav className="bg-[#b8aa8e] text-black p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" passHref>
          <div className="flex items-center cursor-pointer">
            <span className="text-2xl font-bold">DFlix</span>
            <span className="text-sm ml-1">COFFEE ROASTERS</span>
          </div>
        </Link>
        
        {/* Mobile menu button */}
        <button
          className="md:hidden text-black focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          <Link href="/" className="hover:text-white">HOME</Link>
          
          {/* Public routes */}
          <Link href="/products" className="hover:text-white">PRODUCTS</Link>
          <Link href="https://github.com/Guilherme-Denarde" className="hover:text-white">CONTACT</Link>
          
          {/* Auth-dependent routes */}
          {user && (
            <>
              <Link href="/orders" className="hover:text-white">ORDERS</Link>
              {user.isCoffeeMaker && (
                <Link href="/admin/products" className="hover:text-white">MANAGE PRODUCTS</Link>
              )}
            </>
          )}
          
          {/* Cart link */}
          <Link href="/cart" className="relative hover:text-white">
            <FaShoppingCart size={20} />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Link>
          
          {/* Auth buttons */}
          {user ? (
            <div className="relative group">
              <button className="flex items-center hover:text-white">
                <FaUser className="mr-2" />
                {user.displayName || "User"}
              </button>
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 hidden group-hover:block">
                <div className="px-4 py-2 text-sm text-gray-700 border-b">{user.email}</div>
                <button 
                  onClick={signOut}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <FaSignOutAlt className="mr-2" /> Sign out
                </button>
              </div>
            </div>
          ) : (
            <button 
              onClick={signInWithGoogle}
              className="bg-white text-black px-4 py-2 rounded hover:bg-gray-200"
            >
              Sign in
            </button>
          )}
        </div>
        
        {/* Mobile Navigation */}
        {menuOpen && (
          <div className="md:hidden absolute top-16 left-0 right-0 bg-[#b8aa8e] shadow-lg z-10">
            <div className="flex flex-col p-4 space-y-4">
              <Link href="/" className="hover:text-white">HOME</Link>
              <Link href="/products" className="hover:text-white">PRODUCTS</Link>
              <Link href="https://github.com/Guilherme-Denarde" className="hover:text-white">CONTACT</Link>
              
              {user && (
                <>
                  <Link href="/orders" className="hover:text-white">ORDERS</Link>
                  {user.isCoffeeMaker && (
                    <Link href="/admin/products" className="hover:text-white">MANAGE PRODUCTS</Link>
                  )}
                </>
              )}
              
              <Link href="/cart" className="flex items-center hover:text-white">
                <FaShoppingCart size={20} />
                <span className="ml-2">CART ({totalItems})</span>
              </Link>
              
              {user ? (
                <>
                  <div className="border-t pt-2">
                    <div className="text-sm">{user.email}</div>
                    <button 
                      onClick={signOut}
                      className="flex items-center mt-2 hover:text-white"
                    >
                      <FaSignOutAlt className="mr-2" /> Sign out
                    </button>
                  </div>
                </>
              ) : (
                <button 
                  onClick={signInWithGoogle}
                  className="bg-white text-black px-4 py-2 rounded hover:bg-gray-200"
                >
                  Sign in
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;