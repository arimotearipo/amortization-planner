import type { MortgageTermsInputs } from "@/models"

export const BASIC_DEFAULT_VALUES: MortgageTermsInputs = {
	principalLoanAmount: 490000,
	loanTermYears: 35,
	annualInterestRate: 4.5,
	investmentReturnRate: 5,
	extraPayment: {
		startMonth: 0,
		endMonth: 419,
		amount: 1000,
		increment: 200,
		incrementFrequency: "yearly",
		extraPaymentSplitRatio: 0.5, // Default split ratio for extra payments
	},
}

export const ADVANCE_DEFAULT_VALUES: MortgageTermsInputs = {
	principalLoanAmount: 490000,
	loanTermYears: 35,
	annualInterestRate: 3.8,
	investmentReturnRate: 5,
	extraPayment: {
		paymentBlocks: [
			// {
			// 	startMonth: 0,
			// 	endMonth: 119,
			// 	amount: 200,
			// 	splitRatio: 0.5,
			// },
			// {
			// 	startMonth: 120,
			// 	endMonth: 239,
			// 	amount: 200,
			// 	splitRatio: 0.5,
			// },
			// {
			// 	startMonth: 240,
			// 	endMonth: 359,
			// 	amount: 200,
			// 	splitRatio: 0.5,
			// },
			// {
			// 	startMonth: 360,
			// 	endMonth: 419,
			// 	amount: 200,
			// 	splitRatio: 0.5,
			// },
		],
	},
}
