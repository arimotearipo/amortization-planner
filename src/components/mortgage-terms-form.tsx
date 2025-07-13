"use client"

import { Button } from "@components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card"
import { Form, FormField, FormLabel, FormMessage } from "@components/ui/form"
import { Input } from "@components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import z from "zod"
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useMortgage } from "@/context/mortgate-context"
import { ExtraPaymentIncrementFrequency } from "@/types"

const mortgageTermsInputsSchema = z.object({
	principalLoanAmount: z.number().min(1, "Must be greater than 0"),
	loanTermYears: z.number().int("Must be whole number"),
	annualInterestRate: z.number().min(0).max(100),
	extraPayment: z.number().min(0).optional(),
	extraPaymentIncrement: z.number().min(0).optional(),
	extraPaymentIncrementFrequency: z
		.enum(ExtraPaymentIncrementFrequency)
		.optional(),
})

type MortgageTermsInputs = z.infer<typeof mortgageTermsInputsSchema>

export function MortgageTermsForm() {
	const { setMortgageDetails } = useMortgage()

	const form = useForm<MortgageTermsInputs>({
		resolver: zodResolver(mortgageTermsInputsSchema),
		defaultValues: {
			principalLoanAmount: 480000,
			loanTermYears: 35,
			annualInterestRate: 3.8,
			extraPayment: 0,
			extraPaymentIncrement: 0,
			extraPaymentIncrementFrequency: "monthly",
		},
	})

	const handleSubmitForm = form.handleSubmit((data) => {
		console.log("Form submitted with data:", data)
		setMortgageDetails({
			principalLoanAmount: data.principalLoanAmount,
			loanTermYears: data.loanTermYears,
			annualInterestRate: data.annualInterestRate,
			extraPayment: data.extraPayment || 0,
			extraPaymentIncrement: data.extraPaymentIncrement || 0,
			extraPaymentIncrementFrequency:
				data.extraPaymentIncrementFrequency || "monthly",
		})

		toast.success("Mortgage terms saved successfully!")
	})

	return (
		<Form {...form}>
			<Card>
				<CardHeader>
					<CardTitle>Mortgage Terms</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					<FormField
						control={form.control}
						name="principalLoanAmount"
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
						name="loanTermYears"
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
						name="annualInterestRate"
						render={({ field }) => (
							<div className="space-y-2">
								<FormLabel>Annual Interest Rate (%)</FormLabel>
								<Input
									{...field}
									type="number"
									onChange={(e) => field.onChange(Number(e.target.value))}
								/>
								<FormMessage />
							</div>
						)}
					/>

					<Accordion type="single" collapsible>
						<AccordionItem value="options">
							<AccordionTrigger>Options</AccordionTrigger>
							<AccordionContent className="space-y-4">
								<FormField
									control={form.control}
									name="extraPayment"
									render={({ field }) => (
										<div className="space-y-2">
											<FormLabel>Extra Payment (MYR)</FormLabel>
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
									name="extraPaymentIncrement"
									render={({ field }) => (
										<div className="space-y-2">
											<FormLabel>Extra Payment Increment (MYR)</FormLabel>
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
									name="extraPaymentIncrementFrequency"
									render={({ field }) => (
										<div className="space-y-2">
											<FormLabel>Extra Payment Increment Frequency</FormLabel>
											<RadioGroup
												value={field.value}
												onValueChange={field.onChange}
											>
												{ExtraPaymentIncrementFrequency.map((f) => (
													<div key={f} className="flex items-center gap-3">
														<RadioGroupItem value={f} id={f} />
														<Label htmlFor={f} className="capitalize">
															{f}
														</Label>
													</div>
												))}
											</RadioGroup>
										</div>
									)}
								/>
							</AccordionContent>
						</AccordionItem>
					</Accordion>

					<Button onClick={handleSubmitForm} type="button">
						Submit
					</Button>
				</CardContent>
			</Card>
		</Form>
	)
}
