import type { MortgageTermsInputs } from "@/components/models"
import type { AmortizationDetails, Payment } from "@/types"

function getExtraPayments(mortgageArgs: MortgageTermsInputs): number[] {
	const {
		loanTermYears,
		extraPayment = 0,
		extraPaymentIncrement = 0,
		extraPaymentIncrementFrequency = "monthly",
		extraPaymentStartMonth = 0,
		extraPaymentEndMonth = -1,
		extraPaymentSplitRatio = 0.5,
	} = mortgageArgs

	if (extraPayment <= 0) {
		return []
	}

	const extraPayments = []
	const totalMonths = loanTermYears * 12

	let currentExtraPayment = extraPayment * extraPaymentSplitRatio
	for (let i = 0; i < totalMonths; i++) {
		if (extraPaymentEndMonth >= 0 && i >= extraPaymentEndMonth) {
			break // Stop adding extra payments after the end month
		}

		if (i < extraPaymentStartMonth) {
			extraPayments.push(0) // No extra payment before the start month
			continue
		}

		if (extraPaymentIncrementFrequency === "monthly") {
			currentExtraPayment += extraPaymentIncrement * extraPaymentSplitRatio
		}

		if (extraPaymentIncrementFrequency === "yearly" && (i + 1) % 12 === 0) {
			currentExtraPayment += extraPaymentIncrement * extraPaymentSplitRatio
		}

		extraPayments.push(currentExtraPayment)
	}

	return extraPayments
}

function calculateInvestmentGrowthAtEachMonth(
	mortgageArgs: MortgageTermsInputs,
): number[] {
	const { extraPaymentSplitRatio, loanTermYears, investmentReturnRate } =
		mortgageArgs

	const n = loanTermYears * 12
	const r = investmentReturnRate / 12 / 100

	// Get the monthly contributions for investment (portion not used for extra payment)
	// The value returned by getExtraPayments is already factored with extraPaymentSplitRatio.
	// So, use it directly as the investment contributions.

	// Reconstruct the total extra payment for each month (before split)
	const {
		extraPayment = 0,
		extraPaymentIncrement = 0,
		extraPaymentIncrementFrequency = "monthly",
		extraPaymentStartMonth = 0,
		extraPaymentEndMonth = -1,
	} = mortgageArgs

	let currentExtraPayment = extraPayment
	const totalExtraPayments: number[] = []
	for (let i = 0; i < n; i++) {
		if (extraPaymentEndMonth >= 0 && i >= extraPaymentEndMonth) {
			break
		}
		if (i < extraPaymentStartMonth) {
			totalExtraPayments.push(0)
			continue
		}
		if (extraPaymentIncrementFrequency === "monthly") {
			currentExtraPayment += extraPaymentIncrement
		}
		if (extraPaymentIncrementFrequency === "yearly" && (i + 1) % 12 === 0) {
			currentExtraPayment += extraPaymentIncrement
		}
		totalExtraPayments.push(currentExtraPayment)
	}

	// Now, investment portion is (1 - extraPaymentSplitRatio) of total extra payment
	const investmentContributions = totalExtraPayments.map(
		(p) => p * (1 - (extraPaymentSplitRatio ?? 0.5)),
	)

	const accumulatedGrowths: number[] = []
	for (let month = 0; month < n; month++) {
		let sum = 0
		for (let i = 0; i <= month; i++) {
			const monthlyInvestment = investmentContributions[i] || 0
			const periods = month - i
			sum += monthlyInvestment * (1 + r) ** periods
		}
		accumulatedGrowths.push(Number(sum.toFixed(2)))
	}

	return accumulatedGrowths
}

function calculateAmortizationSchedule(
	mortgageArgs: MortgageTermsInputs,
): AmortizationDetails {
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

	const investmentGrowthsAtEachMonth =
		calculateInvestmentGrowthAtEachMonth(mortgageArgs)

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
			investmentGrowth: investmentGrowthsAtEachMonth[month - 1],
		})
	}

	const totalInterest = Number(
		schedule.reduce((sum, payment) => sum + payment.interestPaid, 0).toFixed(2),
	)
	const totalPaid = Number((principalLoanAmount + totalInterest).toFixed(2))
	const totalInvestmentEarned = Number(
		investmentGrowthsAtEachMonth[numberOfPayments - 1].toFixed(2),
	)

	return {
		schedule,
		totalPaid,
		totalInterest,
		totalInvestmentEarned,
	}
}

export { calculateAmortizationSchedule, type Payment }
