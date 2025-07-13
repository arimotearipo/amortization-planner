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

	const { schedule, ...rest } = calculateAmortizationSchedule(
		mortgageDetails.principalLoanAmount,
		mortgageDetails.annualInterestRate,
		mortgageDetails.loanTermYears,
		mortgageDetails.extraPayment,
		mortgageDetails.extraPaymentIncrement,
		mortgageDetails.extraPaymentIncrementFrequency,
	)

	return (
		<div className="space-y-2">
			<MortgageSummary {...rest} numberOfPaymentsMade={schedule.length} />
			<MortgageTable schedule={schedule || []} />
		</div>
	)
}
