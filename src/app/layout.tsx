import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import { Footer } from "@/components/footer"
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
			</head>
			<body
				className={cn(geistSans.variable, geistMono.variable, `antialiased`)}
			>
				<ThemeProvider
					attribute="class"
					defaultTheme="system"
					enableSystem
					disableTransitionOnChange
				>
					<MortgageProvider>
						<main>{children}</main>
					</MortgageProvider>
				</ThemeProvider>
				<Toaster theme="system" richColors />
				<Footer />
			</body>
		</html>
	)
}
