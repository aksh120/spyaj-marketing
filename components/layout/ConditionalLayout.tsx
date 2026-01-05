"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import GlobalWidgets from "@/components/layout/GlobalWidgets";
import CartDrawer from "@/components/layout/CartDrawer";
import InstallPrompt from "@/components/pwa/InstallPrompt";

export default function ConditionalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith("/admin");

  if (isAdminRoute) {
    return <>{children}</>;
  }

  return (
    <>
      <Navbar />
      <main className="flex-grow">{children}</main>
      <Footer />
      <GlobalWidgets />
      <CartDrawer />
      <InstallPrompt />
    </>
  );
}
