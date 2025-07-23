/**
 * the goal here is to produce array of Payment for both generatePaymentBlocksBasic and generatePaymentBlocksAdvance
 */

import { advanceExtraPaymentSchema, basicExtraPaymentSchema, type MortgageTermsInputs } from "@/models"
import type { ExtraPayment } from "@/types"

const EMPTY_PAYMENT: ExtraPayment = {
	month: 0,
	amount: 0,
	splitRatio: 0, // split Ratio does not matter for empty payments
}

// to be used for generating payment blocks if user selects "Basic Extra Payment" option
export function generatePaymentBlocksBasic(inputs: MortgageTermsInputs): ExtraPayment[] {
	if (Object.keys(inputs.extraPayment || {}).length === 0) {
		return []
	}

	const parsed = basicExtraPaymentSchema.safeParse(inputs.extraPayment)
	if (!parsed.success) {
		return []
	}

	const { loanTermYears } = inputs
	const { startMonth, endMonth, amount = 0, increment, extraPaymentSplitRatio, incrementFrequency } = parsed.data

	const paymentBlocks: ExtraPayment[] = []
	const totalMonths = loanTermYears * 12

	let currentAmount = amount
	for (let month = 0; month < totalMonths; month++) {
		const isWithinBlock = month >= startMonth && month < endMonth

		if (!isWithinBlock) {
			paymentBlocks.push(EMPTY_PAYMENT)
			continue
		}

		paymentBlocks.push({
			amount: currentAmount,
			month,
			splitRatio: extraPaymentSplitRatio,
		})

		if (incrementFrequency === "monthly") {
			currentAmount += increment
		}

		// increase the amount just before the next year
		if (incrementFrequency === "yearly" && (month + 1) % 12 === 0) {
			currentAmount += increment
		}
	}

	return paymentBlocks
}

// to be used for generating payment blocks if user selects "Advance Extra Payment" option
export function generatePaymentBlocksAdvance(inputs: MortgageTermsInputs): ExtraPayment[] {
	if (!inputs.extraPayment) {
		return []
	}

	const parsed = advanceExtraPaymentSchema.safeParse(inputs.extraPayment)
	if (!parsed.success) {
		return []
	}

	const { loanTermYears } = inputs
	const { paymentBlocks } = parsed.data

	const spreadedPaymentBlocks: ExtraPayment[] = []
	for (const block of paymentBlocks) {
		for (let month = block.startMonth; month <= block.endMonth; month++) {
			spreadedPaymentBlocks.push({
				month,
				amount: block.amount,
				splitRatio: block.splitRatio,
			})
		}
	}

	const totalMonths = loanTermYears * 12
	// fullPaymentBlocks will contain the full payment blocks for each month from 0 to LOAN_DURATION
	const fullPaymentBlocks: ExtraPayment[] = [] // this is what we returns
	for (let month = 0; month < totalMonths; month++) {
		const foundPayment = spreadedPaymentBlocks.find((p) => month === p.month)

		if (!foundPayment) {
			fullPaymentBlocks.push({ ...EMPTY_PAYMENT, month })
		} else {
			fullPaymentBlocks.push(foundPayment)
		}
	}

	return fullPaymentBlocks
}
