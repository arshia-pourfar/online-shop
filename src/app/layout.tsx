import "../styles/globals.css";
import Navbar from "@/components/Navbar";
import { AuthProvider } from '@/lib/context/authContext';

import { Inter } from "next/font/google";
// import { Roboto } from "next/font/google";
// import { Open_Sans } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });
// const roboto = Roboto({ subsets: ["latin"] });
// const open_sans = Open_Sans({ subsets: ["latin"] });

export const metadata = {
  // Metadata for the app (title, description)
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
          {/* Layout container: sidebar + content */}
          <div className="flex h-screen w-screen overflow-hidden ">

            {/* Sidebar */}
            <Navbar />
            <div className="md:ps-20 "></div>
            {/* Main content area */}
            <main
              className="flex-1 h-full overflow-y-auto overflow-x-hidden md:pt-0 pt-20"
              style={{ width: 'calc(100vw - 80px)' }} // ⬅️ دقیقاً عرض صفحه منهای Navbar
            >
              {children}
            </main>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}




