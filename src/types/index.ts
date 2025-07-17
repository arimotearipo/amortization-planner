// this represents the inputs for advance extra payment
export type PaymentBlock = {
	amount: number
	startMonth: number
	endMonth: number
	splitRatio: number // portion to go towards principal payment
}

export type ExtraPayment = {
	month: number
	amount: number
	splitRatio: number // portion to go towards principal payment
}

// this represents one row in the payment schedule table
export type PaymentItem = {
	paymentNumber: number
	paymentAmount: number
	totalPrincipalPaid: number
	interestPaid: number
	remainingBalance: number
	extraPayment: number
	investmentGrowth: number
}

export type AmortizationDetails = {
	schedule: PaymentItem[]
	totalPaid: number
	totalInterest: number
	totalInvestmentEarned: number
}

export const ExtraPaymentIncrementFrequency = ["monthly", "yearly"] as const
