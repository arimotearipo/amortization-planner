"use client"

import {
	Table,
	TableBody,
	TableCell,
	TableHeader,
	TableRow,
} from "@components/ui/table"
import { useMortgage } from "@/context/mortgate-context"
import { calculateAmortizationSchedule } from "@/lib/amortization"

export function MortgageTable() {
	const { mortgageDetails } = useMortgage()

	if (!mortgageDetails) {
		return <div>No mortgage details available</div>
	}

	const paymentSchedule = calculateAmortizationSchedule(
		mortgageDetails.loanAmount,
		mortgageDetails.interestRate,
		mortgageDetails.loanTerm,
	)

	console.log("Payment Schedule:", paymentSchedule)

	return (
		<Table>
			<TableHeader>
				<TableRow>
					<TableCell>Payment Number</TableCell>
					<TableCell>Payment Amount</TableCell>
					<TableCell>Principal Paid</TableCell>
					<TableCell>Interest Paid</TableCell>
					<TableCell>Remaining Balance</TableCell>
				</TableRow>
			</TableHeader>
			<TableBody>
				{paymentSchedule.map((payment) => (
					<TableRow key={payment.paymentNumber}>
						<TableCell>{payment.paymentNumber}</TableCell>
						<TableCell>{payment.paymentAmount.toFixed(2)}</TableCell>
						<TableCell>{payment.principalPaid.toFixed(2)}</TableCell>
						<TableCell>{payment.interestPaid.toFixed(2)}</TableCell>
						<TableCell>{payment.remainingBalance.toFixed(2)}</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	)
}
