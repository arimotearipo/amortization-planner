export type Payment = {
	paymentNumber: number
	paymentAmount: number
	totalPrincipalPaid: number
	interestPaid: number
	remainingBalance: number
	extraPayment: number
	investmentGrowth: number
}

export type CalculateAmortizationScheduleReturnType = {
	schedule: Payment[]
	totalPaid: number
	totalInterest: number
}

export const ExtraPaymentIncrementFrequency = ["monthly", "yearly"] as const
