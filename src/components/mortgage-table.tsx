"use client"

import {
	Table,
	TableBody,
	TableCell,
	TableHeader,
	TableRow,
} from "@components/ui/table"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useMortgage } from "@/context/mortgate-context"
import { getMonthName } from "@/lib/get-month-name"
import { cn } from "@/lib/utils"

const COL_COUNT = 7

function FullSpanRow({ children }: { children: React.ReactNode }) {
	return (
		<TableRow className="bg-gray-100">
			<TableCell colSpan={COL_COUNT} className="text-center font-bold">
				{children}
			</TableCell>
		</TableRow>
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
			<ScrollArea className="h-full">
				<Table>
					<TableHeader>
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
								<TableRow
									key={payment.paymentNumber}
									className={cn({
										"bg-green-400 font-bold hover:bg-green-300":
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
									<TableCell>{payment.interestPaid.toLocaleString()}</TableCell>
									<TableCell>{payment.extraPayment.toLocaleString()}</TableCell>
									<TableCell>
										{payment.remainingBalance.toLocaleString()}
									</TableCell>
									<TableCell>
										{payment.investmentGrowth?.toLocaleString() ?? "undefined"}
									</TableCell>
								</TableRow>,
							)

							return rows
						})}
						<FullSpanRow>End</FullSpanRow>
					</TableBody>
				</Table>
			</ScrollArea>
		</Card>
	)
}
