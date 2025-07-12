"use client"

import { Button } from "@components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card"
import { Form, FormField, FormLabel, FormMessage } from "@components/ui/form"
import { Input } from "@components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import z from "zod"

const mortgageDetailsInputsSchema = z.object({
	loanAmount: z.number().min(1, "Must be greater than 0"),
	loanTerm: z.number().int("Must be whole number"),
	interestRate: z.number().min(0).max(100),
})

type MortgageDetailsInputs = z.infer<typeof mortgageDetailsInputsSchema>

export function MortgageDetailsForm() {
	const form = useForm<MortgageDetailsInputs>({
		resolver: zodResolver(mortgageDetailsInputsSchema),
		defaultValues: {
			loanAmount: 0,
			loanTerm: 0,
			interestRate: 0,
		},
	})

	const handleSubmitForm = form.handleSubmit((data) => {
		console.log("Form submitted with data:", data)
	})

	return (
		<Form {...form}>
			<Card>
				<CardHeader>
					<CardTitle>Mortgage Details</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					<FormField
						control={form.control}
						name="loanAmount"
						render={({ field }) => (
							<div className="space-y-2">
								<FormLabel>Loan Amount (MYR)</FormLabel>
								<Input
									{...field}
									type="number"
									onChange={(e) => field.onChange(Number(e.target.value))}
								/>
								<FormMessage />
							</div>
						)}
					/>
					<FormField
						control={form.control}
						name="loanTerm"
						render={({ field }) => (
							<div className="space-y-2">
								<FormLabel>Loan Term (Years)</FormLabel>
								<Input
									{...field}
									type="number"
									onChange={(e) => field.onChange(Number(e.target.value))}
								/>
								<FormMessage />
							</div>
						)}
					/>
					<FormField
						control={form.control}
						name="interestRate"
						render={({ field }) => (
							<div className="space-y-2">
								<FormLabel>Interest Rate (%)</FormLabel>
								<Input
									{...field}
									type="number"
									onChange={(e) => field.onChange(Number(e.target.value))}
								/>
								<FormMessage />
							</div>
						)}
					/>
					<Button onClick={handleSubmitForm} type="button">
						Submit
					</Button>
				</CardContent>
			</Card>
		</Form>
	)
}
