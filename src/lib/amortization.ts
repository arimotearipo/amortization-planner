import type { MortgageTermsInputs } from "@/components/models"
import type { CalculateAmortizationScheduleReturnType, Payment } from "@/types"

function getExtraPayments(mortgageArgs: MortgageTermsInputs): number[] {
	const {
		loanTermYears,
		extraPayment = 0,
		extraPaymentIncrement = 0,
		extraPaymentIncrementFrequency = "monthly",
		extraPaymentStartMonth = 0,
		extraPaymentEndMonth = -1,
	} = mortgageArgs

	if (extraPayment <= 0) {
		return []
	}

	const extraPayments = []
	const totalMonths = loanTermYears * 12

	let currentExtraPayment = extraPayment
	for (let i = 0; i < totalMonths; i++) {
		if (extraPaymentEndMonth >= 0 && i >= extraPaymentEndMonth) {
			break // Stop adding extra payments after the end month
		}

		if (i < extraPaymentStartMonth) {
			extraPayments.push(0) // No extra payment before the start month
			continue
		}

		if (extraPaymentIncrementFrequency === "monthly") {
			currentExtraPayment += extraPaymentIncrement
		}

		if (extraPaymentIncrementFrequency === "yearly" && (i + 1) % 12 === 0) {
			currentExtraPayment += extraPaymentIncrement
		}

		extraPayments.push(currentExtraPayment)
	}

	return extraPayments
}

function calculateAmortizationSchedule(
	mortgageArgs: MortgageTermsInputs,
): CalculateAmortizationScheduleReturnType {
	const { loanTermYears, annualInterestRate, principalLoanAmount } =
		mortgageArgs

	/**
	 * Calculate monthly payment using PMT formula:
	 * M = P[r(1 + r)^n] / [(1 + r)^n - 1]
	 * where:
	 * M = total monthly payment
	 * P = principal loan amount
	 * r = monthly interest rate (annual rate / 12)
	 * n = number of payments (loan term in months)
	 */

	const monthlyInterestRate = annualInterestRate / 12 / 100
	const numberOfPayments = loanTermYears * 12

	const monthlyPayment =
		(principalLoanAmount *
			monthlyInterestRate *
			(1 + monthlyInterestRate) ** numberOfPayments) /
		((1 + monthlyInterestRate) ** numberOfPayments - 1)

	let remainingBalance = principalLoanAmount

	const schedule: Payment[] = []

	const extraPayments = getExtraPayments(mortgageArgs)

	for (let month = 1; month <= numberOfPayments; month++) {
		if (remainingBalance <= 0) {
			break
		}

		// Calculate interest for this month
		const interestPaid = Number(
			(remainingBalance * monthlyInterestRate).toFixed(2),
		)

		// Calculate principal for this month
		const principalPaid = Number((monthlyPayment - interestPaid).toFixed(2))

		const thisMonthExtraPayment = extraPayments[month - 1] || 0

		// Update remaining balance
		const totalPrincipalPaid = principalPaid + thisMonthExtraPayment
		remainingBalance -= totalPrincipalPaid

		schedule.push({
			paymentNumber: month,
			paymentAmount: Number(monthlyPayment.toFixed(2)),
			totalPrincipalPaid: Number(totalPrincipalPaid.toFixed(2)),
			interestPaid: Number(interestPaid.toFixed(2)),
			remainingBalance: Number(Math.max(0, remainingBalance).toFixed(2)), // Prevent negative balance due to rounding
			extraPayment: Number(thisMonthExtraPayment.toFixed(2)),
		})
	}

	const totalInterest = Number(
		schedule.reduce((sum, payment) => sum + payment.interestPaid, 0).toFixed(2),
	)
	const totalPaid = Number((principalLoanAmount + totalInterest).toFixed(2))

	return {
		schedule,
		totalPaid,
		totalInterest,
	}
}

export { calculateAmortizationSchedule, type Payment }
