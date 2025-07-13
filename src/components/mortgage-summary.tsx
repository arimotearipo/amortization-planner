"use client"

import { MortgageSummaryChart } from "@/components/mortgage-summary-chart"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useMortgage } from "@/context/mortgate-context"
import { getMonthName } from "@/lib/get-month-name"
import { getOrdinalSuffix } from "@/lib/get-ordinal-suffix"
import { cn } from "@/lib/utils"

export function MortgageSummary() {
	const { amortizationDetails, mortgageTerms, submitted } = useMortgage()

	if (!submitted) {
		return null
	}

	const { schedule, totalPaid, totalInterest, totalInvestmentEarned } =
		amortizationDetails

	const { extraPayment } = mortgageTerms

	const endingYear = getOrdinalSuffix(Math.ceil(schedule.length / 12))

	const crossoverIndex = schedule.findIndex(
		(p) => p.investmentGrowth >= p.remainingBalance,
	)

	const crossoverYear = getOrdinalSuffix(Math.floor(crossoverIndex / 12) + 1)
	const crossoverMonth = getMonthName((crossoverIndex % 12) + 1)

	const netProfit = totalInvestmentEarned - totalInterest

	return (
		<Card className="w-full max-w-none sm:max-w-md lg:max-w-sm lg:h-full animate-in fade-in duration-1000">
			<CardHeader>
				<CardTitle>Mortgage Summary</CardTitle>
			</CardHeader>
			<CardContent>
				<dl className="space-y-2 text-gray-700 dark:text-gray-300">
					<div>
						<dt className="col-span-2 text-sm font-medium text-gray-500">
							Total Paid
						</dt>
						<dd className="col-span-2 text-lg font-bold text-green-700 mb-2">
							{totalPaid.toLocaleString()}
						</dd>
					</div>
					<div>
						<dt className="col-span-2 text-sm font-medium text-gray-500">
							Total Interest Paid
						</dt>
						<dd className="col-span-2 text-lg font-bold text-red-700">
							{totalInterest.toLocaleString()}
						</dd>
					</div>
					<div>
						<dt className="col-span-2 text-sm font-medium text-gray-500">
							Total Investment Earned (by {endingYear} year)
						</dt>
						<dd className="col-span-2 text-lg font-bold text-green-700">
							{totalInvestmentEarned.toLocaleString()}
						</dd>
					</div>
					<div>
						<dt className="col-span-2 text-sm font-medium text-gray-500">
							Your nett profit at the end of the mortgage
						</dt>
						<dd className="col-span-2 text-lg">
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
					<p className="text-xs sm:text-sm">
						With the extra payments you've made, you can expect to fully
						amortize your mortgage by the{" "}
						<span className="font-bold text-primary">{endingYear} year</span>
					</p>
				)}
				{crossoverIndex >= 0 && totalInvestmentEarned > 0 && (
					<p className="text-xs sm:text-sm">
						Your investment will cover your remaining balance in{" "}
						<span className="font-bold text-primary">{crossoverMonth}</span> of
						the <span className="font-bold text-primary">{crossoverYear}</span>{" "}
						year
					</p>
				)}

				<div className="mt-4 sm:mt-6">
					<MortgageSummaryChart
						endingYear={Math.ceil(schedule.length / 12)}
						crossoverYear={Math.floor(crossoverIndex / 12) + 1}
					/>
				</div>
			</CardContent>
		</Card>
	)
}
