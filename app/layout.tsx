import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import '@/shared/client/styled/common/common.css';
import '@/shared/admin/styled/admin_common.css';
import ClientLayout from "./ClientLayout";
import viewport from "./viewport";
import Script from "next/script";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { productGetApi } from "@/features/adminApi/adminProductApi";
import QueryProvider from "./globalProvider/QueryProvider";
import { getCartApi } from "@/features/clientApi/cartApi";
import { orderGetApi } from "@/features/adminApi/adminOrderApi";
import { getUser } from "@/features/serverApi/userApi";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "coffeeOrder",
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true, 
    statusBarStyle: "black-translucent", 
    title: "coffeeOrder",
  },
  icons: { icon: '/icons/icon-192.png', apple: '/icons/icon-192.png' },
};

export {viewport};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const queryClient = new QueryClient();

  const allProduct = await productGetApi(); //전체 제품 조회
  const allCarts = await getCartApi(); //전체 장바구니 조회
  const allOrders = await orderGetApi(); //주문내역 조회

  const user = await getUser();

  await Promise.all([
    queryClient.prefetchQuery({ queryKey: ['products'], queryFn: allProduct }),
    queryClient.prefetchQuery({ queryKey: ['carts'], queryFn: allCarts }),
    queryClient.prefetchQuery({ queryKey: ['orders'], queryFn: allOrders }),
  ]);

  return (
    <html 
      lang="ko"
      suppressHydrationWarning
    >
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <Script
          src="https://pay.nicepay.co.kr/v1/js/"
          strategy="afterInteractive"
        />
        <QueryProvider>
          <HydrationBoundary state={dehydrate(queryClient)}>
            <ClientLayout user={user!}>
                {children}
            </ClientLayout>
          </HydrationBoundary>
        </QueryProvider>
      </body>
    </html>
  );
}
