"use client";

import { useState, useEffect, FormEvent } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";

export default function LoginPage() {
  const { data: session, status } = useSession();
  const [mounted, setMounted] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("customer"); // "customer" or "coffeemaker"
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [emailLogin, setEmailLogin] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
    
    // Check for existing email login
    const savedInfo = localStorage.getItem('customerInfo');
    if (savedInfo) {
      const { name: savedName, email: savedEmail, role: savedRole } = JSON.parse(savedInfo);
      setName(savedName);
      setEmail(savedEmail);
      if (savedRole) setRole(savedRole);
    }
  }, []);

  if (!mounted) {
    return null;
  }
  
  const handleEmailLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
  
    try {
      // Simple validation
      if (!email.includes('@') || name.length < 2) {
        throw new Error("Please enter a valid email and name");
      }
  
      // Store customer info in localStorage for simple persistence
      localStorage.setItem(
        "customerInfo",
        JSON.stringify({
          name,
          email,
          role,
          loginTime: new Date().toISOString(),
        })
      );
  
      // You could also send this to your backend if needed
      // const response = await fetch('your-backend-url/customers', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ name, email, role })
      // });
  
      setIsLoading(false);
    } catch (err) {
      setError("An error occurred during checkout. Please try again later.");
      console.error(err);
      setIsLoading(false);
    }
  };
  
  const handleLogout = () => {
    localStorage.removeItem('customerInfo');
    setName("");
    setEmail("");
    
    // Also sign out from Google if signed in
    if (session) {
      signOut();
    }
  };
  
  const isLoggedIn = session || (email && name);
  
  const userInfo = session?.user || { name, email, role };

  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      {/* Navigation Bar */}
      <header className="bg-[#d5c9a6] text-black p-4">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/" className="text-xl font-bold">
            DFlix COFFEE ROASTERS
          </Link>
          <nav className="hidden md:flex space-x-6">
            <Link href="/" className="hover:underline">HOME</Link>
            <Link href="/contact" className="hover:underline">CONTACT</Link>
            <Link href="/orders" className="hover:underline">ORDERS</Link>
            <Link href="/cart" className="hover:underline">
              <span className="sr-only">Cart</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="21" r="1"></circle>
                <circle cx="20" cy="21" r="1"></circle>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
              </svg>
            </Link>
          </nav>
          <button className="md:hidden">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
        </div>
      </header>

      {/* Main Login Content */}
      <main className="flex-grow flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Login Card */}
          <div className="bg-[#1c1c1c] rounded-lg shadow-2xl overflow-hidden border border-[#d5c9a6]/20">
            {/* Header with Coffee Beans Background */}
            <div className="relative h-40 bg-gradient-to-r from-[#3c2a14] to-[#5a3b1c] flex items-center justify-center">
              <div className="absolute inset-0 opacity-20 bg-[url('/coffee-beans-pattern.png')]"></div>
              <h1 className="text-3xl font-bold relative z-10 text-[#d5c9a6]">
                Welcome to DFlix
              </h1>
            </div>

            {/* Login Form Section */}
            <div className="p-8">
              {status === "loading" || isLoading ? (
                <div className="flex justify-center py-8">
                  <div className="w-8 h-8 border-4 border-[#d5c9a6] border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : isLoggedIn ? (
                <div className="text-center">
                  <div className="mb-6 flex flex-col items-center">
                    {session?.user?.image ? (
                      <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-[#d5c9a6] mb-4">
                        <Image
                          src={session.user.image}
                          alt={session.user.name || "User"}
                          width={80}
                          height={80}
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-[#d5c9a6] mb-4 flex items-center justify-center bg-[#3c2a14]">
                        <span className="text-3xl text-[#d5c9a6]">{userInfo.name?.charAt(0).toUpperCase() || "C"}</span>
                      </div>
                    )}
                    <h2 className="text-2xl font-bold text-[#d5c9a6]">
                      Hello, {userInfo.name || "Coffee Lover"}
                    </h2>
                    <p className="text-gray-400 mt-2">You&apos;re now signed in</p>
                  </div>

                  <div className="space-y-4">
                    {role === "customer" ? (
                      <Link
                        href="/orders"
                        className="block w-full py-3 px-4 bg-[#d5c9a6] text-black font-semibold rounded-md text-center hover:bg-[#c0b38c] transition"
                      >
                        View Your Orders
                      </Link>
                    ) : (
                      <Link
                        href="/admin/orders"
                        className="block w-full py-3 px-4 bg-[#d5c9a6] text-black font-semibold rounded-md text-center hover:bg-[#c0b38c] transition"
                      >
                        Manage Orders
                      </Link>
                    )}
                    
                    <div className="flex gap-2">
                      <button
                        onClick={() => setRole("customer")}
                        className={`flex-1 py-2 px-4 border font-medium rounded-md text-center transition ${
                          role === "customer" 
                            ? "bg-[#d5c9a6] text-black border-[#d5c9a6]" 
                            : "bg-transparent border-[#d5c9a6]/40 text-[#d5c9a6]/70 hover:bg-[#d5c9a6]/10"
                        }`}
                      >
                        Customer
                      </button>
                      <button
                        onClick={() => {
                          setRole("coffeemaker");
                          localStorage.setItem('customerInfo', JSON.stringify({
                            name: userInfo.name,
                            email: userInfo.email,
                            role: "coffeemaker",
                            loginTime: new Date().toISOString()
                          }));
                        }}
                        className={`flex-1 py-2 px-4 border font-medium rounded-md text-center transition ${
                          role === "coffeemaker" 
                            ? "bg-[#d5c9a6] text-black border-[#d5c9a6]" 
                            : "bg-transparent border-[#d5c9a6]/40 text-[#d5c9a6]/70 hover:bg-[#d5c9a6]/10"
                        }`}
                      >
                        Coffee Maker
                      </button>
                    </div>
                    
                    <button
                      onClick={handleLogout}
                      className="block w-full py-3 px-4 bg-transparent border border-[#d5c9a6] text-[#d5c9a6] font-semibold rounded-md text-center hover:bg-[#d5c9a6]/10 transition"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <h2 className="text-xl font-medium mb-6 text-[#d5c9a6]">
                    Sign in to your account
                  </h2>

                  {error && (
                    <div className="mb-4 p-3 bg-red-900/30 border border-red-800 rounded-md text-red-200 text-sm">
                      {error}
                    </div>
                  )}

                  <div className="mb-4 flex justify-center">
                    <div className="inline-flex rounded-md overflow-hidden border border-[#d5c9a6]/30">
                      <button
                        onClick={() => setEmailLogin(false)}
                        className={`px-4 py-2 text-sm font-medium ${
                          !emailLogin 
                            ? "bg-[#d5c9a6] text-black" 
                            : "bg-transparent text-[#d5c9a6]"
                        }`}
                      >
                        Google Login
                      </button>
                      <button
                        onClick={() => setEmailLogin(true)}
                        className={`px-4 py-2 text-sm font-medium ${
                          emailLogin 
                            ? "bg-[#d5c9a6] text-black" 
                            : "bg-transparent text-[#d5c9a6]"
                        }`}
                      >
                        Email Login
                      </button>
                    </div>
                  </div>

                  {emailLogin ? (
                    <form onSubmit={handleEmailLogin} className="space-y-4">
                      <div>
                        <label className="block text-left text-[#d5c9a6] mb-1 text-sm" htmlFor="name">
                          Your Name
                        </label>
                        <input
                          id="name"
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full p-3 bg-[#2c2c2c] rounded-md border border-[#d5c9a6]/30 text-white focus:outline-none focus:border-[#d5c9a6]"
                          placeholder="Enter your name"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-left text-[#d5c9a6] mb-1 text-sm" htmlFor="email">
                          Email Address
                        </label>
                        <input
                          id="email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full p-3 bg-[#2c2c2c] rounded-md border border-[#d5c9a6]/30 text-white focus:outline-none focus:border-[#d5c9a6]"
                          placeholder="Enter your email"
                          required
                        />
                      </div>
                      
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setRole("customer")}
                          className={`flex-1 py-2 px-4 border font-medium rounded-md text-center transition ${
                            role === "customer" 
                              ? "bg-[#d5c9a6] text-black border-[#d5c9a6]" 
                              : "bg-transparent border-[#d5c9a6]/40 text-[#d5c9a6]/70 hover:bg-[#d5c9a6]/10"
                          }`}
                        >
                          Customer
                        </button>
                        <button
                          type="button"
                          onClick={() => setRole("coffeemaker")}
                          className={`flex-1 py-2 px-4 border font-medium rounded-md text-center transition ${
                            role === "coffeemaker" 
                              ? "bg-[#d5c9a6] text-black border-[#d5c9a6]" 
                              : "bg-transparent border-[#d5c9a6]/40 text-[#d5c9a6]/70 hover:bg-[#d5c9a6]/10"
                          }`}
                        >
                          Coffee Maker
                        </button>
                      </div>
                      
                      <button 
                        type="submit"
                        className="w-full py-3 px-4 bg-[#d5c9a6] text-black font-semibold rounded-md text-center hover:bg-[#c0b38c] transition mt-4"
                      >
                        Sign In
                      </button>
                    </form>
                  ) : (
                    <div className="space-y-4">
                      <button
                        onClick={() => signIn("google")}
                        className="flex items-center justify-center w-full py-3 px-4 bg-white text-black font-medium rounded-md hover:bg-gray-100 transition"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          width="24"
                          height="24"
                          className="mr-2"
                        >
                          <path
                            fill="#4285F4"
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                          />
                          <path
                            fill="#34A853"
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                          />
                          <path
                            fill="#FBBC05"
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                          />
                          <path
                            fill="#EA4335"
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                          />
                        </svg>
                        Sign in with Google
                      </button>
                      
                      <div className="text-sm text-center mt-2">
                        <button 
                          type="button"
                          onClick={() => setRole("customer")}
                          className={`px-3 py-1 mr-2 rounded text-xs transition ${
                            role === "customer" 
                              ? "bg-[#d5c9a6] text-black" 
                              : "bg-transparent text-[#d5c9a6] border border-[#d5c9a6]/30"
                          }`}
                        >
                          Sign in as Customer
                        </button>
                        <button 
                          type="button"
                          onClick={() => setRole("coffeemaker")}
                          className={`px-3 py-1 rounded text-xs transition ${
                            role === "coffeemaker" 
                              ? "bg-[#d5c9a6] text-black" 
                              : "bg-transparent text-[#d5c9a6] border border-[#d5c9a6]/30"
                          }`}
                        >
                          Sign in as Coffee Maker
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="mt-8 text-sm text-gray-500">
                    <p>
                      By signing in, you agree to our{" "}
                      <Link href="/terms" className="text-[#d5c9a6] hover:underline">
                        Terms of Service
                      </Link>{" "}
                      and{" "}
                      <Link href="/privacy" className="text-[#d5c9a6] hover:underline">
                        Privacy Policy
                      </Link>
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer Note */}
          <div className="mt-8 text-center text-gray-500 text-sm">
            <p>
              DFlix Coffee Roasters — Carefully sourced and roasted to perfection
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}