import { Montserrat, Open_Sans } from "next/font/google";
import "./globals.css";

// Montserrat for headings - bold, modern, clean (matching main app)
const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800"],
});

// Open Sans for body text - readable, professional (matching main app)
const openSans = Open_Sans({
  subsets: ["latin"],
  variable: "--font-opensans",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata = {
  title: "MK Rentals Admin Dashboard",
  description: "Manage your rental business",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${montserrat.variable} ${openSans.variable} font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
