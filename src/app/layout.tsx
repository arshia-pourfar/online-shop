import Navbar from "@/components/Navbar";
import { AuthProvider } from "@/lib/context/authContext";
import "../styles/globals.css";

import { Inter } from "next/font/google";
import { CartProvider } from "@/lib/context/cartContext";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});
export const metadata = {
  title: "Online Shop",
  description: "A dashboard for managing orders",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} bg-[var(--color-primary-bg)] text-[var(--color-primary-text)] overflow-hidden antialiased`}
      >
        <AuthProvider>
          <div className="flex h-[100dvh] w-screen overflow-y-auto overflow-x-hidden">
            <Navbar />
            <div className="md:pl-20"></div>
            <main
              className="flex-1 h-full overflow-y-auto overflow-x-hidden md:pt-0 pt-20"
              style={{
                height: "100dvh",
                paddingBottom: "env(safe-area-inset-bottom)",
                width: "calc(100vw - 80px)",
              }}
            >
              <CartProvider>
                {children}
              </CartProvider>
            </main>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}