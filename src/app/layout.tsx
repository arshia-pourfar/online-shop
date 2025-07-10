import "../styles/globals.css";
import { Inter } from "next/font/google";
// import { Roboto } from "next/font/google";
// import { Open_Sans } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });
// const roboto = Roboto({ subsets: ["latin"] });
// const open_sans = Open_Sans({ subsets: ["latin"] });
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}
