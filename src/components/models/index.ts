import { z } from "zod"
import { ExtraPaymentIncrementFrequency } from "@/types"

export const mortgageTermsInputsSchema = z.object({
	principalLoanAmount: z.number().min(1, "Must be greater than 0"),
	loanTermYears: z.number().int("Must be whole number"),
	annualInterestRate: z.number().min(0).max(100),
	extraPaymentStartMonth: z.number().int(),
	extraPaymentEndMonth: z.number().int(),
	extraPayment: z.number().min(0).optional(),
	extraPaymentIncrement: z.number().min(0).optional(),
	extraPaymentIncrementFrequency: z
		.enum(ExtraPaymentIncrementFrequency)
		.optional(),
})
export type MortgageTermsInputs = z.infer<typeof mortgageTermsInputsSchema>
