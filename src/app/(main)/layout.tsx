import Link from "next/link";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <nav className="flex gap-4 p-4 bg-gray-900 text-white">
        <Link href="/pedidos">Pedidos</Link>
        <Link href="/produtos">Produtos</Link>
      </nav>
      <main>{children}</main>
    </div>
  );
}
