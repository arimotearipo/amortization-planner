type Payment = {
	paymentNumber: number
	paymentAmount: number
	principalPaid: number
	interestPaid: number
	remainingBalance: number
}

function calculateAmortizationSchedule(
	loanAmount: number,
	annualInterestRate: number,
	loanTermYears: number,
): Payment[] {
	const monthlyRate = annualInterestRate / 12 / 100
	const numberOfPayments = loanTermYears * 12

	// Calculate monthly payment using PMT formula
	const monthlyPayment =
		(loanAmount * monthlyRate * (1 + monthlyRate) ** numberOfPayments) /
		((1 + monthlyRate) ** numberOfPayments - 1)

	let remainingBalance = loanAmount
	const schedule: Payment[] = []

	for (let month = 1; month <= numberOfPayments; month++) {
		// Calculate interest for this month
		const interestPaid = remainingBalance * monthlyRate

		// Calculate principal for this month
		const principalPaid = monthlyPayment - interestPaid

		// Update remaining balance
		remainingBalance -= principalPaid

		schedule.push({
			paymentNumber: month,
			paymentAmount: monthlyPayment,
			principalPaid: principalPaid,
			interestPaid: interestPaid,
			remainingBalance: Math.max(0, remainingBalance), // Prevent negative balance due to rounding
		})
	}

	return schedule
}

export { calculateAmortizationSchedule, type Payment }
