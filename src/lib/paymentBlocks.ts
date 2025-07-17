/**
 * the goal here is to produce array of Payment for both generatePaymentBlocksBasic and generatePaymentBlocksAdvance
 */

import { basicExtraPaymentSchema, type MortgageTermsInputs } from "@/components/models"
import type { ExtraPayment } from "@/types"

const EMPTY_PAYMENT: ExtraPayment = {
	month: 0,
	amount: 0,
	splitRatio: 0, // split Ratio does not matter for empty payments
}

// to be used for generating payment blocks if user selects "Basic Extra Payment" option
export function generatePaymentBlocksBasic(inputs: MortgageTermsInputs): ExtraPayment[] {
	if (!inputs.extraPayment) {
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

		if (incrementFrequency === "yearly" && month % 12 === 0) {
			currentAmount += increment
		}
	}

	return paymentBlocks
}

// to be used for generating payment blocks if user selects "Advance Extra Payment" option
export function generatePaymentBlocksAdvance(inputs: MortgageTermsInputs) {}
