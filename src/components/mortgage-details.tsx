"use client"

import { useMortgage } from "@/context/mortgate-context"
import { calculateAmortizationSchedule } from "@/lib/amortization"
import { MortgageSummary } from "./mortgage-summary"
import { MortgageTable } from "./mortgage-table"

export function MortgageDetails() {
	const { mortgageDetails } = useMortgage()

	if (!mortgageDetails) {
		return <div>No mortgage details available</div>
	}

	const amortization = calculateAmortizationSchedule(mortgageDetails)

	const inflectionPoint = amortization.schedule.findIndex(
		(payment) => payment.investmentGrowth > payment.remainingBalance,
	)

	return (
		<div className="space-y-2">
			<MortgageSummary
				totalInterest={amortization.totalInterest}
				numberOfPaymentsMade={amortization.schedule.length}
				totalPaid={amortization.totalPaid}
				inflectionPoint={inflectionPoint}
			/>
			<MortgageTable
				schedule={amortization.schedule || []}
				inflectionPoint={inflectionPoint}
			/>
		</div>
	)
}
