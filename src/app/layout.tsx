import "../styles/globals.css";
import Navbar from "@/components/Navbar";
import { AuthProvider } from '@/lib/context/authContext';
import { CartProvider } from '@/lib/context/cartContext';

import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: 'Order Dashboard',
  description: 'A dashboard for managing orders',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-primary-bg text-primary-text overflow-hidden`}>
        <AuthProvider>
          <CartProvider>
            <div className="flex h-[100dvh] w-screen overflow-y-auto overflow-x-hidden">
              {/* Sidebar */}
              <Navbar />
              <div className="md:ps-20"></div>
              {/* Main content area */}
              <main
                className="flex-1 h-full overflow-y-auto overflow-x-hidden md:pt-0 pt-20"
                style={{
                  height: '100dvh',
                  paddingBottom: 'env(safe-area-inset-bottom)',
                  width: 'calc(100vw - 80px)',
                }}
              >
                {children}
              </main>
            </div>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
