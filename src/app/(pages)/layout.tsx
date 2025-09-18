// layout.tsx
import "@/styles/globals.css";
import "react-toastify/dist/ReactToastify.css";
import { GeistSans } from "geist/font/sans";
import { ApplicationLayout } from "./ApplicationLayout";
import { getEvents } from "@/data";
import type { ReactNode } from "react";
import Providers from "@/context/SessionProvider";
import { ToastContainer } from "react-toastify";

export const metadata = {
  title: {
    template: "%s - NearBite",
    default: "Dashboard - NearBite",
  },
  description: "Fresh Deals on Every Last Bite",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
  session,
}: {
  children: ReactNode;
  session: any;
}) {
  const events = getEvents();

  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <body suppressHydrationWarning={true}>
        <Providers session={session}>
          <ToastContainer />
          <ApplicationLayout events={events}>{children}</ApplicationLayout>
        </Providers>
      </body>
    </html>
  );
}
