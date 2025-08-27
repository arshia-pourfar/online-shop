import Navbar from "@/components/Navbar";
import { AuthProvider } from "@/lib/context/authContext";
import "../styles/globals.css";

// اگر میخوای از next/font/google بدون Turbopack استفاده کنی:
import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Order Dashboard",
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
            {/* Sidebar */}
            <Navbar />
            {/* فاصله برای Sidebar روی موبایل / دسکتاپ */}
            <div className="md:pl-20"></div>

            {/* Main content area */}
            <main
              className="flex-1 h-full overflow-y-auto overflow-x-hidden md:pt-0 pt-20"
              style={{
                height: "100dvh",
                paddingBottom: "env(safe-area-inset-bottom)",
                width: "calc(100vw - 80px)", // اگر Sidebar 80px باشه
              }}
            >
              {children}
            </main>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
