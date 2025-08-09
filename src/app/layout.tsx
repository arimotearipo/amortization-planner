import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import { Footer } from "@/components/footer"
import { Header } from "@/components/header"
import { Toaster } from "@/components/ui/sonner"
import { AppStatusProvider } from "@/context/app-status-context"
import { MortgageProvider } from "@/context/mortgate-context"
import { ThemeProvider } from "@/context/theme-context"
import { cn } from "@/lib/utils"
import "driver.js/dist/driver.css"
import { DriverProvider } from "@/context/driver-context"

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
	description: "Plan how to pay off your mortgage faster with ease",
	authors: [{ name: "Ari", url: "https://github.com/arimotearipo" }],
	openGraph: {
		title: "Amortization Planner",
		description: "Plan how to pay off your mortgage faster with ease",
		type: "website",
		url: "https://amortization-planner.vercel.app",
		images: ["/favicon.png"],
	},
	twitter: {
		card: "summary_large_image",
		title: "Amortization Planner",
		description: "Plan how to pay off your mortgage faster with ease",
		images: ["/favicon.svg"],
	},
	icons: {
		icon: "/favicon.svg",
	},
}

export const viewport: Viewport = {
	width: "device-width",
	initialScale: 1,
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<head>
				<link rel="icon" href="/favicon.svg" />
				<meta name="keywords" content="amortization, mortgage, planner, loan, payment, finance, calculator" />
				<meta name="author" content="Ari" />
				<meta property="og:title" content="Amortization Planner" />
				<meta property="og:description" content="Plan how to pay off your mortgage with ease" />
				<meta property="og:type" content="website" />
				<meta property="og:image" content="/favicon.svg" />
				<meta property="og:url" content="https://amortization-planner.com" />
				<meta name="twitter:card" content="summary_large_image" />
				<meta name="twitter:title" content="Amortization Planner" />
				<meta name="twitter:description" content="Plan how to pay off your mortgage with ease" />
				<meta name="twitter:image" content="/favicon.svg" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				{/* <script crossOrigin="anonymous" src="//unpkg.com/react-scan/dist/auto.global.js" /> */}
			</head>
			<body className={cn(geistSans.variable, geistMono.variable, `antialiased flex flex-col min-h-screen`)}>
				<ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
					<Header />
					<AppStatusProvider>
						<MortgageProvider>
							<DriverProvider>
								<main className="flex flex-col flex-1 min-h-0 px-2">{children}</main>
							</DriverProvider>
						</MortgageProvider>
					</AppStatusProvider>
					<Footer />
				</ThemeProvider>
				<Toaster theme="system" richColors />
			</body>
		</html>
	)
}
