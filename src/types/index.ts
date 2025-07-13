export type Payment = {
	paymentNumber: number
	paymentAmount: number
	principalPaid: number
	interestPaid: number
	remainingBalance: number
}

export type CalculateAmortizationScheduleReturnType = {
	schedule: Payment[]
	totalPaid: number
	totalInterest: number
}
