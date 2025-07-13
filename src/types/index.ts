export type Payment = {
	paymentNumber: number
	paymentAmount: number
	totalPrincipalPaid: number
	interestPaid: number
	remainingBalance: number
	extraPayment: number
	investmentGrowth: number
}

export type AmortizationDetails = {
	schedule: Payment[]
	totalPaid: number
	totalInterest: number
	totalInvestmentEarned: number
}

export const ExtraPaymentIncrementFrequency = ["monthly", "yearly"] as const
