import "../styles/globals.css";
import Navbar from "@/components/Navbar";

import { Inter } from "next/font/google";
// import { Roboto } from "next/font/google";
// import { Open_Sans } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });
// const roboto = Roboto({ subsets: ["latin"] });
// const open_sans = Open_Sans({ subsets: ["latin"] });

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
      <body className={`${inter.className} flex bg-primary-bg text-primary-text overflow-hidden`}>
        <div className="flex bg-primary-bg text-primary-text">
          <Navbar />
          <main className="flex-grow flex w-screen h-screen overflow-y-visible">
            <div className="ps-64"> </div>
            {children}

          </main>
        </div>
      </body>
    </html>
  );
}



