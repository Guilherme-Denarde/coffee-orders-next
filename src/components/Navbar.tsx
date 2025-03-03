import React, { useState } from "react";
import Link from "next/link";
import { useCart } from "../context/CartContext";
import { FaShoppingCart, FaBars, FaTimes } from "react-icons/fa";

const Navbar: React.FC = () => {
  const { totalItems } = useCart();
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
          {/* <Link href="#" className="hover:text-white">ABOUT US</Link> */}
          {/* <Link href="#" className="hover:text-white">MENU</Link> */}
          {/* <Link href="#" className="hover:text-white">WHERE TO FIND</Link> */}
          <Link href="https://github.com/Guilherme-Denarde" className="hover:text-white">CONTACT</Link>
          <Link href="/orders" className="hover:text-white">ORDERS</Link>
          <Link href="/cart" className="relative hover:text-white">
            <FaShoppingCart size={20} />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Link>
        </div>

        {/* Mobile Navigation */}
        {menuOpen && (
          <div className="md:hidden absolute top-16 left-0 right-0 bg-[#b8aa8e] shadow-lg z-10">
            <div className="flex flex-col p-4 space-y-4">
              <Link href="/" className="hover:text-white">HOME</Link>
              <Link href="#" className="hover:text-white">ABOUT US</Link>
              <Link href="#" className="hover:text-white">MENU</Link>
              <Link href="#" className="hover:text-white">WHERE TO FIND</Link>
              <Link href="#" className="hover:text-white">CONTACT</Link>
              <Link href="/orders" className="hover:text-white">ORDERS</Link>
              <Link href="/cart" className="flex items-center hover:text-white">
                <FaShoppingCart size={20} />
                <span className="ml-2">CART ({totalItems})</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;