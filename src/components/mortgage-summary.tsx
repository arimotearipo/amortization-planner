"use client"

import { SocialMediaShare } from "@/components/social-media-share"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAppStatus } from "@/context/app-status-context"
import { useMortgage } from "@/context/mortgate-context"
import { getOrdinalSuffix } from "@/lib/get-ordinal-suffix"
import { cn } from "@/lib/utils"

export function MortgageSummary() {
	const { amortizationDetails, mortgageTerms } = useMortgage()
	const { submitted } = useAppStatus()

	if (!submitted) {
		return null
	}

	const { schedule, totalPaid, totalInterest, totalInvestmentEarned } = amortizationDetails

	const { extraPayment } = mortgageTerms

	const endingYear = getOrdinalSuffix(Math.ceil(schedule.length / 12))

	const crossoverIndex = schedule.findIndex((p) => p.investmentGrowth >= p.remainingBalance)

	const crossoverYear = getOrdinalSuffix(Math.floor(crossoverIndex / 12) + 1)
	const crossoverMonth = getOrdinalSuffix((crossoverIndex % 12) + 1)

	const netProfit = totalInvestmentEarned - totalInterest

	return (
		<Card className="w-full animate-in fade-in duration-1000">
			<CardHeader>
				<CardTitle>Mortgage Summary</CardTitle>
			</CardHeader>
			<CardContent>
				<dl className="grid grid-cols-1 md:grid-cols-4">
					<div>
						<dt className="text-sm font-medium text-gray-500">Principal Loan Amount</dt>
						<dd className="font-bold">{mortgageTerms.principalLoanAmount.toLocaleString()}</dd>
					</div>
					<div>
						<dt className="text-sm font-medium text-gray-500">Annual Interest Rate</dt>
						<dd className="font-bold">{mortgageTerms.annualInterestRate.toLocaleString()}%</dd>
					</div>
					<div>
						<dt className="text-sm font-medium text-gray-500">Loan Term</dt>
						<dd className="font-bold">{mortgageTerms.loanTermYears.toLocaleString()} years</dd>
					</div>
					<div>
						<dt className="text-sm font-medium text-gray-500">Investment Return Rate</dt>
						<dd className="font-bold">{mortgageTerms.investmentReturnRate.toLocaleString()}%</dd>
					</div>
				</dl>
				<dl className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 text-gray-700 dark:text-gray-300">
					<div>
						<dt className="col-span-2 text-sm font-medium text-gray-500">Monthly Payment</dt>
						<dd className="col-span-2 text-lg font-bold text-green-700 mb-2">
							{schedule[0].paymentAmount.toLocaleString()}
						</dd>
					</div>
					<div>
						<dt className="col-span-2 text-sm font-medium text-gray-500">Total Paid</dt>
						<dd className="col-span-2 text-lg font-bold text-green-700 mb-2">{totalPaid.toLocaleString()}</dd>
					</div>
					<div>
						<dt className="col-span-2 text-sm font-medium text-gray-500">Total Interest Paid</dt>
						<dd className="col-span-2 text-lg font-bold text-red-700">{totalInterest.toLocaleString()}</dd>
					</div>
					<div>
						<dt className="col-span-2 text-sm font-medium text-gray-500">
							Total Investment Earned (by {endingYear} year)
						</dt>
						<dd className="col-span-2 text-lg font-bold text-green-700">{totalInvestmentEarned.toLocaleString()}</dd>
					</div>
					<div className="colspan-1 md:col-span-2 lg:col-span-4">
						<dt className="text-sm font-medium text-gray-500">
							Your nett profit at the end of the mortgage
							<span className="text-xs"> (Investment Earned - Interest Paid)</span>
						</dt>
						<dd className="text-lg">
							<span className="font-bold text-primary">{`${totalInvestmentEarned.toLocaleString()} - ${totalInterest.toLocaleString()} = `}</span>
							<span
								className={cn("font-bold", {
									"text-green-700": netProfit >= 0,
									"text-red-700": netProfit < 0,
								})}
							>
								{netProfit.toLocaleString()}
							</span>
						</dd>
					</div>
				</dl>
				{!!extraPayment && (
					<p className="text-xs sm:text-sm col-span-1 md:col-span-2 lg:col-span-4">
						With the payment plan you've made, you can expect to fully amortize your mortgage by the{" "}
						<span className="font-bold text-primary">{endingYear} year</span>
					</p>
				)}
				{crossoverIndex >= 0 && totalInvestmentEarned > 0 && (
					<p className="text-xs sm:text-sm">
						Your investment will cover your remaining balance in{" "}
						<span className="font-bold text-primary">{crossoverMonth} month</span> of the{" "}
						<span className="font-bold text-primary">{crossoverYear} year</span>
					</p>
				)}
			</CardContent>
		</Card>
	)
}
