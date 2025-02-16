import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import SessionProvider from "./components/SessionProvider";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";
import connectToDatabase from "./lib/connect";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "HealthBuddy | Home",
  description: "HealthBuddy is a health tracking app.",
};

export default async function RootLayout({ children }) {
  const session = await getServerSession({ authOptions });
  await connectToDatabase();

  return (
    <html lang="en">
      <SessionProvider session={session}>
        <body className={inter.className}>
          <Navbar />
          {children}
        </body>
      </SessionProvider>
    </html>
  );
}
