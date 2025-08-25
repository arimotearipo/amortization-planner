import { toDecimal } from "@/lib/to-decimal"
import type { MortgageTermsInputs } from "@/models"
import type { AmortizationDetails, ExtraPayment, PaymentItem } from "@/types"

function calculateInvestmentGrowthAtEachMonth(investmentReturnRate: number, extraPayments: ExtraPayment[]): number[] {
	const r = investmentReturnRate / 12 / 100

	const accumulatedGrowths: number[] = []
	for (let n = 0; n < extraPayments.length; n++) {
		let sum = 0
		for (let k = 0; k <= n; k++) {
			const extraPayment = extraPayments[k]
			const portionToInvest = (1 - extraPayment.splitRatio) * extraPayment.amount
			sum += portionToInvest * (1 + r) ** (n - k)
		}
		accumulatedGrowths.push(toDecimal(sum))
	}

	return accumulatedGrowths
}

export function calculateAmortizationSchedule(
	mortgageTerms: MortgageTermsInputs,
	extraPayments: ExtraPayment[],
): AmortizationDetails {
	const { loanTermYears, annualInterestRate, principalLoanAmount, investmentReturnRate } = mortgageTerms

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
		(principalLoanAmount * monthlyInterestRate * (1 + monthlyInterestRate) ** numberOfPayments) /
		((1 + monthlyInterestRate) ** numberOfPayments - 1)

	let remainingBalance = principalLoanAmount
	let cumulativeInterest = 0 // Track cumulative interest for better precision

	const schedule: PaymentItem[] = []
	const investmentGrowthsAtEachMonth = calculateInvestmentGrowthAtEachMonth(investmentReturnRate, extraPayments)

	for (let month = 0; month < numberOfPayments; month++) {
		// Using small value instead of 0 to cater for better precision
		if (remainingBalance <= 0.01) {
			break
		}

		const startingBalance = remainingBalance

		// Calculate interest with high precision
		const interestPaid = remainingBalance * monthlyInterestRate
		cumulativeInterest += interestPaid

		// Calculate principal with high precision
		let principalPaid = monthlyPayment - interestPaid

		// Handle edge cases with better precision
		if (principalPaid > remainingBalance) {
			principalPaid = remainingBalance
		}

		// Get extra payment details
		const thisMonthSplitRatio = extraPayments[month]?.splitRatio || 0
		const extraPaymentAmount = extraPayments[month]?.amount || 0

		let thisMonthExtraPaymentToPrincipal = extraPaymentAmount * thisMonthSplitRatio
		const thisMonthInvestmentContribution = extraPaymentAmount * (1 - thisMonthSplitRatio)

		// Calculate total principal with high precision
		let totalPrincipalPaid = principalPaid + thisMonthExtraPaymentToPrincipal

		// Handle remaining balance constraints
		if (totalPrincipalPaid > remainingBalance) {
			totalPrincipalPaid = remainingBalance
			thisMonthExtraPaymentToPrincipal = Math.max(0, remainingBalance - principalPaid)
			principalPaid = remainingBalance - thisMonthExtraPaymentToPrincipal
		}

		// Update remaining balance with high precision
		remainingBalance = Math.max(0, remainingBalance - totalPrincipalPaid)

		// Only apply toDecimal() when storing final values
		schedule.push({
			paymentNumber: month,
			startingBalance: toDecimal(startingBalance),
			paymentAmount: toDecimal(monthlyPayment),
			principalPaid: toDecimal(principalPaid),
			totalPrincipalPaid: toDecimal(totalPrincipalPaid),
			interestPaid: toDecimal(interestPaid),
			remainingBalance: toDecimal(remainingBalance),
			extraPaymentToPrincipal: toDecimal(thisMonthExtraPaymentToPrincipal),
			investmentContribution: toDecimal(thisMonthInvestmentContribution),
			investmentGrowth: toDecimal(investmentGrowthsAtEachMonth[month]),
		})
	}

	// Use high precision cumulative interest instead of summing rounded values
	const totalInterest = toDecimal(cumulativeInterest)
	const totalPaid = toDecimal(principalLoanAmount + cumulativeInterest)
	const totalInvestmentEarned = toDecimal(schedule.at(-1)?.investmentGrowth || 0)

	return {
		schedule,
		totalPaid,
		totalInterest,
		totalInvestmentEarned,
	}
}
