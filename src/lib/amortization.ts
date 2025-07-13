import type { CalculateAmortizationScheduleReturnType, Payment } from "@/types"

function calculateAmortizationSchedule(
	loanAmount: number,
	annualInterestRate: number,
	loanTermYears: number,
): CalculateAmortizationScheduleReturnType {
	/**
	 * Calculate monthly payment using PMT formula:
	 * M = P[r(1 + r)^n] / [(1 + r)^n - 1]
	 * where:
	 * M = total monthly payment
	 * P = principal loan amount
	 * r = monthly interest rate (annual rate / 12)
	 * n = number of payments (loan term in months)
	 */

	const principalLoanAmount = loanAmount
	const monthlyInterestRate = annualInterestRate / 12 / 100
	const numberOfPayments = loanTermYears * 12

	// const monthlyPayment =
	// 	(loanAmount * monthlyRate * (1 + monthlyRate) ** numberOfPayments) /
	// 	((1 + monthlyRate) ** numberOfPayments - 1)
	const monthlyPayment =
		(principalLoanAmount *
			monthlyInterestRate *
			(1 + monthlyInterestRate) ** numberOfPayments) /
		((1 + monthlyInterestRate) ** numberOfPayments - 1)

	let remainingBalance = loanAmount
	const schedule: Payment[] = []

	for (let month = 1; month <= numberOfPayments; month++) {
		// Calculate interest for this month
		const interestPaid = Number(
			(remainingBalance * monthlyInterestRate).toFixed(2),
		)

		// Calculate principal for this month
		const principalPaid = Number((monthlyPayment - interestPaid).toFixed(2))

		// Update remaining balance
		remainingBalance -= principalPaid

		schedule.push({
			paymentNumber: month,
			paymentAmount: Number(monthlyPayment.toFixed(2)),
			principalPaid: Number(principalPaid.toFixed(2)),
			interestPaid: Number(interestPaid.toFixed(2)),
			remainingBalance: Number(Math.max(0, remainingBalance).toFixed(2)), // Prevent negative balance due to rounding
		})
	}

	const totalInterest = Number(
		schedule.reduce((sum, payment) => sum + payment.interestPaid, 0).toFixed(2),
	)
	const totalPaid = Number((loanAmount + totalInterest).toFixed(2))

	return {
		schedule,
		totalPaid,
		totalInterest,
	}
}

export { calculateAmortizationSchedule, type Payment }
