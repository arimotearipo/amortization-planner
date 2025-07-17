import { z } from "zod"
import { ExtraPaymentIncrementFrequency } from "@/types"

export const basicExtraPaymentSchema = z.object({
	startMonth: z.number().int(),
	endMonth: z.number().int(),
	amount: z.number().min(0),
	increment: z.number().min(0),
	incrementFrequency: z.enum(ExtraPaymentIncrementFrequency),
	extraPaymentSplitRatio: z.number().min(0).max(1),
})

export const advanceExtraPaymentSchema = z.object({
	paymentBlocks: z.array(
		z.object({
			amount: z.number().min(0),
			startMonth: z.number().int(),
			endMonth: z.number().int(),
			splitRatio: z.number().min(0).max(1),
		}),
	),
})

export const mortgageTermsInputsSchema = z.object({
	principalLoanAmount: z.number().min(1, "Must be greater than 0"),
	loanTermYears: z.number().int("Must be whole number"),
	annualInterestRate: z.number().min(0.01).max(100),
	investmentReturnRate: z.number().min(0).max(100),
	extraPayment: z.union([basicExtraPaymentSchema, advanceExtraPaymentSchema]).optional(),
})

export type MortgageTermsInputs = z.infer<typeof mortgageTermsInputsSchema>
export type BasicExtraPaymentInputs = z.infer<typeof basicExtraPaymentSchema>
export type AdvanceExtraPaymentInputs = z.infer<typeof advanceExtraPaymentSchema>
