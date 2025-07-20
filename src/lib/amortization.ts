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

	const schedule: PaymentItem[] = []

	const investmentGrowthsAtEachMonth = calculateInvestmentGrowthAtEachMonth(investmentReturnRate, extraPayments)

	for (let month = 0; month < numberOfPayments; month++) {
		if (remainingBalance <= 0) {
			break
		}

		// capture the starting balance for this month
		const startingBalance = remainingBalance

		// Calculate interest for this month
		const interestPaid = toDecimal(remainingBalance * monthlyInterestRate)

		// Calculate principal for this month
		let principalPaid = toDecimal(monthlyPayment - interestPaid)

		// If the principal paid exceeds the remaining balance, adjust it
		if (principalPaid > remainingBalance) {
			principalPaid = remainingBalance
		}

		const thisMonthSplitRatio = extraPayments[month]?.splitRatio || 0
		const thisMonthExtraPaymentToPrincipal = extraPayments[month].amount * thisMonthSplitRatio || 0
		const thisMonthInvestmentContribution = extraPayments[month].amount * (1 - thisMonthSplitRatio) || 0

		let totalPrincipalPaid = principalPaid + thisMonthExtraPaymentToPrincipal

		if (totalPrincipalPaid > remainingBalance) {
			totalPrincipalPaid = remainingBalance
			principalPaid = Math.max(0, totalPrincipalPaid - thisMonthExtraPaymentToPrincipal)
		}

		// Update remaining balance
		remainingBalance -= totalPrincipalPaid

		schedule.push({
			paymentNumber: month,
			startingBalance: toDecimal(startingBalance),
			paymentAmount: toDecimal(monthlyPayment),
			totalPrincipalPaid: toDecimal(totalPrincipalPaid),
			interestPaid: toDecimal(interestPaid),
			remainingBalance: toDecimal(Math.max(0, remainingBalance)), // Prevent negative balance due to rounding
			extraPaymentToPrincipal: toDecimal(thisMonthExtraPaymentToPrincipal),
			investmentContribution: toDecimal(thisMonthInvestmentContribution),
			investmentGrowth: toDecimal(investmentGrowthsAtEachMonth[month]),
		})
	}

	const totalInterest = toDecimal(schedule.reduce((sum, payment) => sum + payment.interestPaid, 0))
	const totalPaid = toDecimal(principalLoanAmount + totalInterest)
	const totalInvestmentEarned = toDecimal(investmentGrowthsAtEachMonth[numberOfPayments - 1])

	return {
		schedule,
		totalPaid,
		totalInterest,
		totalInvestmentEarned,
	}
}
