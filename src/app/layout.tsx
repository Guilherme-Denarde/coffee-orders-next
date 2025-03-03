import Providers from "./providers";
import "./globals.css";

export const metadata = {
  title: "Coffee Orders",
  description: "App de Pedidos e Produtos",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
