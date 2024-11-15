import "@styles/globals.css";
import { Metadata } from "next";
import { dir } from "i18next";
import { languages } from "@/utils/locales/settings.js";

import Providers from "./providers";

export async function generateStaticParams() {
  return languages.map((lng) => ({ lng }));
}

export const metadata: Metadata = {
  title: {
    default: "DYOS",
    template: "%s | DYOS",
  },
  description: "DYOS",
  metadataBase: new URL(`https://${process.env.NEXT_PUBLIC_HOST}`),
  openGraph: {
    title: "DYOS",
    description: "DYOS",
    images: [`/api/og?title=DYOS`],
  },
  twitter: {
    card: "summary_large_image",
  },
  icons: [
    {
      rel: "icon",
      type: "image/png",
      sizes: "32x32",
      url: "/icons/apple-icon.png",
    },
    {
      rel: "icon",
      type: "image/png",
      sizes: "16x16",
      url: "/icons/apple-icon.png",
    },
    {
      rel: "apple-touch-icon",
      sizes: "180x180",
      url: "/icons/apple-icon.png",
    },
  ],
};

export default async function RootLayout(props: {
  children: React.ReactNode;
  params: Promise<{ lng: string }>;
}) {
  const params = await props.params;

  const { lng } = params;

  const { children } = props;

  return (
    <html suppressHydrationWarning lang={lng} dir={dir(lng)}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
