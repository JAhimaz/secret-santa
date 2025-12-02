import type { Metadata } from "next";
import "./globals.css";
import Navigation from "@/components/atoms/Navigation/Navigation";

export const metadata: Metadata = {
  title: "Secret Santa",
  description: "A fun and festive secret santa gift exchange web app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <section className={"app-container"}>
          <Navigation />
          <section className={"content-container"}>
            {children}
          </section>
        </section>
      </body>
    </html>
  );
}
