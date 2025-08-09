import type { MortgageTermsInputs } from "@/models"

export const BASIC_DEFAULT_VALUES: MortgageTermsInputs = {
	principalLoanAmount: 0,
	loanTermYears: 0,
	annualInterestRate: 0,
	investmentReturnRate: 0,
	extraPayment: {
		startMonth: 0,
		endMonth: 0,
		amount: 0,
		increment: 0,
		incrementFrequency: "yearly",
		extraPaymentSplitRatio: 0.5, // Default split ratio for extra payments
	},
}

export const ADVANCE_DEFAULT_VALUES: MortgageTermsInputs = {
	principalLoanAmount: 0,
	loanTermYears: 0,
	annualInterestRate: 0,
	investmentReturnRate: 0,
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
