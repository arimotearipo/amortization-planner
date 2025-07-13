"use client"

import {
	Table,
	TableBody,
	TableCell,
	TableHeader,
	TableRow,
} from "@components/ui/table"
import type { ReactNode } from "react"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import {
	HoverCard,
	HoverCardContent,
	HoverCardTrigger,
} from "@/components/ui/hover-card"
import { useMortgage } from "@/context/mortgate-context"
import { getMonthName } from "@/lib/get-month-name"
import { cn } from "@/lib/utils"

const COL_COUNT = 7

function FullSpanRow({ children }: { children: React.ReactNode }) {
	return (
		<TableRow className="bg-background">
			<TableCell colSpan={COL_COUNT} className="text-center font-bold">
				{children}
			</TableCell>
		</TableRow>
	)
}

function CrossoverPointHoverCard({
	children,
	isCrossoverPoint,
}: {
	children: ReactNode
	isCrossoverPoint: boolean
}) {
	if (!isCrossoverPoint) {
		return <>{children}</>
	}

	return (
		<HoverCard>
			<HoverCardTrigger asChild>{children}</HoverCardTrigger>
			<HoverCardContent className="w-80 bg-primary">
				<p className="text-xs text-primary-foreground">
					This is the point where your investment growth surpasses your
					remaining mortgage balance. After this point, you could potentially
					pay off your mortgage using your investment growth.
				</p>
			</HoverCardContent>
		</HoverCard>
	)
}

export function MortgageTable() {
	const { amortizationDetails, submitted } = useMortgage()

	if (!submitted) {
		return null
	}

	const { schedule } = amortizationDetails

	const crossoverPoint = schedule.findIndex(
		(p) => p.investmentGrowth >= p.remainingBalance,
	)

	return (
		<Card className="w-full h-screen animate-in fade-in duration-1000">
			<CardHeader>
				<CardTitle>Amortization Schedule</CardTitle>
			</CardHeader>
			{/* <ScrollArea className="h-full"> */}
			<div className="h-full overflow-auto relative">
				<Table>
					<TableHeader className="sticky top-0 bg-background">
						<TableRow>
							<TableCell className="font-bold">Payment Number</TableCell>
							<TableCell className="font-bold">Payment Amount</TableCell>
							<TableCell className="font-bold">Principal Paid</TableCell>
							<TableCell className="font-bold">Interest Paid</TableCell>
							<TableCell className="font-bold">Extra Payment</TableCell>
							<TableCell className="font-bold">Remaining Balance</TableCell>
							<TableCell className="font-bold">Investment Growth</TableCell>
						</TableRow>
					</TableHeader>
					<TableBody>
						{schedule.map((payment, index) => {
							if (payment.remainingBalance <= 0) {
								return null
							}

							const rows = []

							if ((payment.paymentNumber - 1) % 12 === 0) {
								const year = Math.floor((payment.paymentNumber - 1) / 12) + 1
								rows.push(
									<FullSpanRow key={`year-${year}`}>Year {year}</FullSpanRow>,
								)
							}

							rows.push(
								<CrossoverPointHoverCard
									key={`hover-${payment.paymentNumber}`}
									isCrossoverPoint={index === crossoverPoint}
								>
									<TableRow
										key={payment.paymentNumber}
										className={cn({
											"bg-green-400 text-black font-bold hover:bg-green-300":
												index === crossoverPoint,
										})}
									>
										<TableCell>
											{payment.paymentNumber} -{" "}
											{getMonthName(payment.paymentNumber)}
										</TableCell>
										<TableCell>
											{payment.paymentAmount.toLocaleString()}
										</TableCell>
										<TableCell>
											{payment.totalPrincipalPaid.toLocaleString()}
										</TableCell>
										<TableCell>
											{payment.interestPaid.toLocaleString()}
										</TableCell>
										<TableCell>
											{payment.extraPayment.toLocaleString()}
										</TableCell>
										<TableCell>
											{payment.remainingBalance.toLocaleString()}
										</TableCell>
										<TableCell>
											{payment.investmentGrowth?.toLocaleString() ??
												"undefined"}
										</TableCell>
									</TableRow>
								</CrossoverPointHoverCard>,
							)

							return rows
						})}
						<FullSpanRow>End</FullSpanRow>
					</TableBody>
				</Table>
			</div>
			{/* </ScrollArea> */}
		</Card>
	)
}
