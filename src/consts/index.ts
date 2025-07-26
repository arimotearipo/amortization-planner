export const ICON_SIZE = 14

export const MORTGATE_TERM_IDS = {
	loanAmount: "loan-amount",
	loanTerm: "loan-term",
	annualInterestRate: "annual-interest-rate",
	investmentReturnRate: "investment-return-rate",
	modeSwitch: "mode-switch",
} as const

export const BASIC_EXTRA_PAYMENT_IDS = {
	basicExtraPaymentAmount: "basic-extra-payment-amount",
	basicExtraPaymentIncrement: "basic-extra-payment-increment",
	basicExtraPaymentIncrementFrequency: "basic-extra-payment-increment-frequency",
	basicExtraPaymentStartMonth: "basic-extra-payment-start-month",
	basicExtraPaymentEndMonth: "basic-extra-payment-end-month",
	basicExtraPaymentSplitRatio: "basic-extra-payment-split-ratio",
} as const

export const ADVANCE_EXTRA_PAYMENT_IDS = {
	advanceExtraPayment: "advance-extra-payment",
	advanceExtraPaymentAmount: "advance-extra-payment-amount",
	advanceExtraPaymentStartMonth: "advance-extra-payment-start-month",
	advanceExtraPaymentEndMonth: "advance-extra-payment-end-month",
	advanceExtraPaymentSplitRatio: "advance-extra-payment-split-ratio",
	addBlockButton: "add-block-button",
	blockList: "block-list",
} as const
