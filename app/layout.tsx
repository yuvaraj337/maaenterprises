import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MAA Enterprises | Northstar EV Electric Scooters",
  description:
    "Explore Northstar EV electric scooters at MAA Enterprises. Enquire about available colours, scooter sales, service, spare parts, and EMI options.",
  keywords: [
    "MAA Enterprises",
    "Northstar EV",
    "Northstar EV electric scooters",
    "electric scooters Mahagama",
    "MAA Enterprises Mahagama",
    "Bajaj Finserv EMI electric scooter",
    "electric scooter showroom Mahagama",
    "J.K. Poddar Northstar EV",
    "green mobility Jharkhand"
  ],
  openGraph: {
    title: "MAA Enterprises | Northstar EV Electric Scooters",
    description:
      "Explore Northstar EV electric scooters at MAA Enterprises. Enquire about available colours, scooter sales, service, spare parts, and EMI options.",
    siteName: "MAA Enterprises — Northstar EV",
    images: [
      {
        url: "/scooters/turquoise.jpg",
        width: 1200,
        height: 630,
        alt: "MAA Enterprises Northstar EV Electric Scooters Showroom",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-[#07090E] text-white antialiased selection:bg-[#00E5FF] selection:text-black">
        {children}
      </body>
    </html>
  );
}
