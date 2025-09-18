import "@/styles/globals.css";
import "react-toastify/dist/ReactToastify.css";
import { type Metadata } from "next";
import Head from "next/head";

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
    <>
      <Head>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {children}
    </>
  );
}
