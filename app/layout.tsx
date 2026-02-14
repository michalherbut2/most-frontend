// import type { Metadata } from "next";
// import { Geist, Geist_Mono } from "next/font/google";
// import { Inter } from "next/font/google";
// import "./globals.css";
// import { Navbar } from "@/shared/components/Navbar";
// import { AuthProvider } from "@/features/auth/AuthContext";

// const inter = Inter({ subsets: ["latin"] });

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

// export const metadata: Metadata = {
//   title: "Aplikacja MOSTu",
//   description:
//     "Aplikacja do komunikacji dla Salezjańskiego Duszpasterstwa MOST",
// };

// export default function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
//   return (
//     <html lang="pl">
//       <body
//         className={inter.className}
//         // className={`${geistSans.variable} ${geistMono.variable} antialiased`}
//       >
//         <AuthProvider>
//           <Navbar />

//           {children}

//           {/* Opcjonalnie: Stopka (Footer) */}
//           <footer className="bg-white border-t py-6 text-center text-gray-500 text-sm">
//             &copy; {new Date().getFullYear()} Wspólnota MOST. Stworzone z ❤️ i
//             ☕.
//           </footer>
//         </AuthProvider>
//       </body>
//     </html>
//   );
// }
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Navbar } from "@/shared/components/layout/Navbar";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "MOST - Community Platform",
  description:
    "A community platform with gamification, calendar, songs, and team management",
  keywords: ["community", "gamification", "calendar", "team", "platform"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen bg-slate-50 font-sans antialiased">
        <Providers>
          {/* Smart Navbar - Adapts to auth state */}
          <Navbar />

          {/* Main Content Area */}
          <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            {children}
          </main>
        </Providers>
        {/* Footer */}
        <footer className="mt-auto border-t border-slate-200 bg-white">
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            <p className="text-center text-sm text-slate-600">
              © {new Date().getFullYear()} MOST Platform. Built with Next.js &
              Spring Boot.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
