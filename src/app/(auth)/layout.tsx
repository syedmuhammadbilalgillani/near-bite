import "@/styles/globals.css";
import "react-toastify/dist/ReactToastify.css";
import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";

export const metadata: Metadata = {
  title: {
    template: "%s - NearBite",
    default: "Dashboard - NearBite",
  },
  description: "Fresh Deals on Every Last Bite",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <body suppressHydrationWarning={true}>{children}</body>
    </html>
  );
}
