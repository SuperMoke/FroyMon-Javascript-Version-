import { Inter } from "next/font/google";
import "./globals.css";
import Provider from './Provider'

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "FroyMon",
  description: "Computer Laboratory System",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
