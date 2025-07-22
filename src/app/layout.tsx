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
  // Main layout component
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // HTML and body structure, applies theme and context
    <html lang="en">
      <body className={`${inter.className} flex bg-primary-bg text-primary-text overflow-hidden`}>
        <AuthProvider>
          <div className="flex bg-primary-bg text-primary-text">
            <Navbar />
            {/* <Header /> */}
            {/* Main content area */}
            <main className="flex-grow flex w-screen h-screen overflow-y-auto">
              <div className="ps-20"></div>
              {children}
            </main>
          </div>
        </AuthProvider>
      </body>
    </html >
  );
}



