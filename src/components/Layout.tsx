import React, { ReactNode } from "react";
import Head from "next/head";
import Navbar from "./Navbar";

interface LayoutProps {
  children: ReactNode;
  title?: string;
}

const Layout: React.FC<LayoutProps> = ({ children, title = "DFlix Coffee Roasters" }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Head>
        <title>{title}</title>
        <meta name="description" content="DFlix Coffee Roasters - Specialty coffee shop" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Navbar />

      <main className="flex-grow container mx-auto px-4 py-8">{children}</main>

      <footer className="bg-[#b8aa8e] text-black py-6">
        <div className="container mx-auto px-4 text-center">
          <p>© {new Date().getFullYear()} DFlix Coffee Roasters. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;