"use client"

import { AdvanceSplitRatio } from "@/components/advance-split-ratio"
import { BasicSplitRatio } from "@/components/basic-split-ratio"
import { useMortgage } from "@/context/mortgate-context"
import {
	type AdvanceExtraPaymentInputs,
	advanceExtraPaymentSchema,
	type BasicExtraPaymentInputs,
	basicExtraPaymentSchema,
} from "@/models"

export function SplitRatio() {
	const { mortgageTerms } = useMortgage()

	const parseBasic = basicExtraPaymentSchema.safeParse(mortgageTerms.extraPayment)
	const parseAdvance = advanceExtraPaymentSchema.safeParse(mortgageTerms.extraPayment)

	if (parseBasic.success) {
		const extraPayment = parseBasic.data as BasicExtraPaymentInputs
		return <BasicSplitRatio splitRatio={extraPayment.extraPaymentSplitRatio} />
	}

	if (parseAdvance.success) {
		const extraPayment = parseAdvance.data as AdvanceExtraPaymentInputs
		const allSplitRatios = extraPayment.paymentBlocks.map((block) => ({
			splitRatio: block.splitRatio,
			id: Math.random().toString(36).substring(2, 15),
		}))
		return <AdvanceSplitRatio splitRatios={allSplitRatios} />
	}

	return null
}
