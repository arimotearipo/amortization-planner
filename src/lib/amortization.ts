import type { MortgageTermsInputs } from "@/components/models"
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
		accumulatedGrowths.push(Number(sum.toFixed(2)))
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

	const schedule: PaymentItem[] = []

	const investmentGrowthsAtEachMonth = calculateInvestmentGrowthAtEachMonth(investmentReturnRate, extraPayments)

	for (let month = 1; month <= numberOfPayments; month++) {
		if (remainingBalance <= 0) {
			break
		}

		// Calculate interest for this month
		const interestPaid = Number((remainingBalance * monthlyInterestRate).toFixed(2))

		// Calculate principal for this month
		const principalPaid = Number((monthlyPayment - interestPaid).toFixed(2))

		const thisMonthExtraPayment = extraPayments[month - 1] || 0

		// Update remaining balance
		const totalPrincipalPaid = principalPaid + thisMonthExtraPayment.amount
		remainingBalance -= totalPrincipalPaid

		schedule.push({
			paymentNumber: month,
			paymentAmount: Number(monthlyPayment.toFixed(2)),
			totalPrincipalPaid: Number(totalPrincipalPaid.toFixed(2)),
			interestPaid: Number(interestPaid.toFixed(2)),
			remainingBalance: Number(Math.max(0, remainingBalance).toFixed(2)), // Prevent negative balance due to rounding
			extraPayment: Number(thisMonthExtraPayment.amount.toFixed(2)),
			investmentGrowth: investmentGrowthsAtEachMonth[month - 1],
		})
	}

	const totalInterest = Number(schedule.reduce((sum, payment) => sum + payment.interestPaid, 0).toFixed(2))
	const totalPaid = Number((principalLoanAmount + totalInterest).toFixed(2))
	const totalInvestmentEarned = Number(investmentGrowthsAtEachMonth[numberOfPayments - 1].toFixed(2))

	return {
		schedule,
		totalPaid,
		totalInterest,
		totalInvestmentEarned,
	}
}
