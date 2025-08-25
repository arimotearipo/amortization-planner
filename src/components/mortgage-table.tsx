"use client"

import { Table, TableBody, TableCell, TableHeader, TableRow } from "@components/ui/table"
import type { ReactNode } from "react"
import {
	ExtraPaymentToPrincipalTHCard,
	InterestPaidTHCard,
	InvestmentContributionTHCard,
	InvestmentGrowthTHCard,
	PaymentAmountTHCard,
	PaymentNumberTHCard,
	PrincipalPaidTHCard,
	RemainingBalanceTHCard,
	StartingBalanceTHCard,
	TotalPrincipalPaidTHCard,
} from "@/components/hover-cards"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { useAppStatus } from "@/context/app-status-context"
import { useMortgage } from "@/context/mortgate-context"
import { cn } from "@/lib/utils"

const COL_COUNT = 10

function FullSpanRow({ children }: { children: React.ReactNode }) {
	return (
		<TableRow className="bg-background">
			<TableCell colSpan={COL_COUNT} className="text-center font-bold">
				{children}
			</TableCell>
		</TableRow>
	)
}

function CrossoverPointHoverCard({ children, isCrossoverPoint }: { children: ReactNode; isCrossoverPoint: boolean }) {
	if (!isCrossoverPoint) {
		return <>{children}</>
	}

	return (
		<HoverCard>
			<HoverCardTrigger asChild>{children}</HoverCardTrigger>
			<HoverCardContent className="w-80 bg-primary">
				<p className="text-xs text-primary-foreground">
					This is the point where your investment growth surpasses your remaining mortgage balance. After this point,
					you could potentially pay off your mortgage using your investment growth.
				</p>
			</HoverCardContent>
		</HoverCard>
	)
}

export function MortgageTable() {
	const { amortizationDetails } = useMortgage()
	const { submitted } = useAppStatus()

	if (!submitted) {
		return null
	}

	const { schedule } = amortizationDetails

	const crossoverPoint = schedule.findIndex((p) => p.investmentGrowth >= p.remainingBalance)

	return (
		<Card className="w-full animate-in fade-in duration-1000">
			<CardHeader>
				<CardTitle>Amortization Schedule</CardTitle>
			</CardHeader>
			<CardContent>
				<ScrollArea className="h-[50vh]">
					<Table>
						<TableHeader className="sticky top-0 bg-secondary">
							<TableRow className="[&>*]:whitespace-normal">
								<TableCell className="font-bold text-xs sm:text-sm max-w-[80px]">
									<PaymentNumberTHCard>
										<span>Payment Number</span>
									</PaymentNumberTHCard>
								</TableCell>
								<TableCell className="font-bold text-xs sm:text-sm max-w-[80px]">
									<StartingBalanceTHCard>
										<span>Starting Balance</span>
									</StartingBalanceTHCard>
								</TableCell>
								<TableCell className="font-bold text-xs sm:text-sm max-w-[80px]">
									<PaymentAmountTHCard>
										<span>Payment Amount</span>
									</PaymentAmountTHCard>
								</TableCell>
								<TableCell className="font-bold text-xs sm:text-sm max-w-[80px]">
									<PrincipalPaidTHCard>
										<span>Principal Paid</span>
									</PrincipalPaidTHCard>
								</TableCell>
								<TableCell className="font-bold text-xs sm:text-sm max-w-[80px]">
									<ExtraPaymentToPrincipalTHCard>
										<span>Extra Payment to Principal</span>
									</ExtraPaymentToPrincipalTHCard>
								</TableCell>
								<TableCell className="font-bold text-xs sm:text-sm max-w-[80px]">
									<TotalPrincipalPaidTHCard>
										<span>Total Principal Paid</span>
									</TotalPrincipalPaidTHCard>
								</TableCell>
								<TableCell className="font-bold text-xs sm:text-sm max-w-[80px]">
									<InterestPaidTHCard>
										<span>Interest Paid</span>
									</InterestPaidTHCard>
								</TableCell>
								<TableCell className="font-bold text-xs sm:text-sm max-w-[80px]">
									<RemainingBalanceTHCard>
										<span>Remaining Balance</span>
									</RemainingBalanceTHCard>
								</TableCell>
								<TableCell className="font-bold text-xs sm:text-sm max-w-[80px]">
									<InvestmentContributionTHCard>
										<span>Investment Contribution</span>
									</InvestmentContributionTHCard>
								</TableCell>
								<TableCell className="font-bold text-xs sm:text-sm max-w-[80px]">
									<InvestmentGrowthTHCard>
										<span>Investment Growth</span>
									</InvestmentGrowthTHCard>
								</TableCell>
							</TableRow>
						</TableHeader>
						<TableBody>
							{schedule.map((payment, index) => {
								const rows = []

								if (payment.paymentNumber % 12 === 0) {
									const year = Math.floor(payment.paymentNumber / 12) + 1
									rows.push(<FullSpanRow key={`year-${year}`}>Year {year}</FullSpanRow>)
								}

								rows.push(
									<CrossoverPointHoverCard
										key={`hover-${payment.paymentNumber}`}
										isCrossoverPoint={index === crossoverPoint}
									>
										<TableRow
											key={payment.paymentNumber}
											className={cn({
												"bg-green-400 text-black font-bold hover:bg-green-300": index === crossoverPoint,
											})}
										>
											<TableCell className="text-xs sm:text-sm min-w-[120px]">#{payment.paymentNumber + 1}</TableCell>
											<TableCell className="text-xs sm:text-sm min-w-[120px]">
												{payment.startingBalance.toLocaleString()}
											</TableCell>
											<TableCell className="text-xs sm:text-sm min-w-[120px]">
												{payment.paymentAmount.toLocaleString()}
											</TableCell>
											<TableCell className="text-xs sm:text-sm min-w-[120px]">
												{payment.principalPaid.toLocaleString()}
											</TableCell>
											<TableCell className="text-xs sm:text-sm min-w-[120px]">
												{payment.extraPaymentToPrincipal.toLocaleString()}
											</TableCell>
											<TableCell className="text-xs sm:text-sm min-w-[120px]">
												{payment.totalPrincipalPaid.toLocaleString()}
											</TableCell>
											<TableCell className="text-xs sm:text-sm min-w-[120px]">
												{payment.interestPaid.toLocaleString()}
											</TableCell>
											<TableCell className="text-xs sm:text-sm min-w-[120px]">
												{payment.remainingBalance.toLocaleString()}
											</TableCell>
											<TableCell className="text-xs sm:text-sm min-w-[120px]">
												{payment.investmentContribution?.toLocaleString() ?? "undefined"}
											</TableCell>
											<TableCell className="text-xs sm:text-sm min-w-[120px]">
												{payment.investmentGrowth?.toLocaleString() ?? "undefined"}
											</TableCell>
										</TableRow>
									</CrossoverPointHoverCard>,
								)

								return rows
							})}
							<FullSpanRow>End</FullSpanRow>
						</TableBody>
					</Table>
					<ScrollBar orientation="horizontal" />
				</ScrollArea>
			</CardContent>
		</Card>
	)
}
