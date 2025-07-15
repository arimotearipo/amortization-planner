import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import { Footer } from "@/components/footer"
import { Header } from "@/components/header"
import { Toaster } from "@/components/ui/sonner"
import { MortgageProvider } from "@/context/mortgate-context"
import { ThemeProvider } from "@/context/theme-context"
import { cn } from "@/lib/utils"

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
})

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
})

export const metadata: Metadata = {
	title: "Amortization Planner",
	description: "Plan how to pay off your mortgage with ease",
	viewport: "width=device-width, initial-scale=1",
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<head>
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<link rel="icon" href="/favicon.svg" />
			</head>
			<body
				className={cn(
					geistSans.variable,
					geistMono.variable,
					`antialiased flex flex-col min-h-screen`,
				)}
			>
				<ThemeProvider
					attribute="class"
					defaultTheme="system"
					enableSystem
					disableTransitionOnChange
				>
					<Header />
					<MortgageProvider>
						<main className="flex flex-col flex-1 min-h-0 px-2">
							{children}
						</main>
					</MortgageProvider>
					<Footer />
				</ThemeProvider>
				<Toaster theme="system" richColors />
			</body>
		</html>
	)
}
