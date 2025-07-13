"use client"

import { Button } from "@components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card"
import { Form, FormField, FormLabel, FormMessage } from "@components/ui/form"
import { Input } from "@components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { InfoIcon } from "lucide-react"
import type React from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import {
	type MortgageTermsInputs,
	mortgageTermsInputsSchema,
} from "@/components/models"
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useMortgage } from "@/context/mortgate-context"
import { ExtraPaymentIncrementFrequency } from "@/types"

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
			extraPaymentIncrementFrequency: "yearly",
			extraPaymentStartMonth: 0,
			extraPaymentEndMonth: 0,
		},
	})

	const maxMonthIndex = form.watch("loanTermYears") * 12 - 1

	const handleSubmitForm = form.handleSubmit((data) => {
		if (
			data.extraPaymentStartMonth < 0 ||
			data.extraPaymentStartMonth > maxMonthIndex
		) {
			toast.error(
				`Extra payment start month must be between 0 (inclusive) and ${maxMonthIndex} (inclusive)`,
			)
			return
		}

		if (
			data.extraPaymentEndMonth > maxMonthIndex ||
			data.extraPaymentEndMonth < data.extraPaymentStartMonth
		) {
			toast.error(
				`Extra payment end month must be between ${data.extraPaymentStartMonth} (inclusive) and ${maxMonthIndex} (inclusive)`,
			)
			return
		}

		console.log("Form submitted with data:", data)
		setMortgageDetails({
			principalLoanAmount: data.principalLoanAmount,
			loanTermYears: data.loanTermYears,
			annualInterestRate: data.annualInterestRate,
			extraPayment: data.extraPayment || 0,
			extraPaymentIncrement: data.extraPaymentIncrement || 0,
			extraPaymentIncrementFrequency:
				data.extraPaymentIncrementFrequency || "monthly",
			extraPaymentStartMonth: data.extraPaymentStartMonth,
			extraPaymentEndMonth: data.extraPaymentEndMonth,
		})

		toast.success("Mortgage terms saved successfully!")
	})

	const handleLoanTermChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const numOfMonths = Number(e.target.value) * 12
		form.setValue("loanTermYears", Number(e.target.value))

		form.setValue("extraPaymentStartMonth", 0)
		form.setValue("extraPaymentEndMonth", numOfMonths - 1)
	}

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
									onChange={handleLoanTermChange}
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

								{!!form.watch("extraPayment") && (
									<>
										<Alert variant={"default"}>
											<InfoIcon />
											<AlertTitle>Extra Payment Term</AlertTitle>
											<AlertDescription>
												{`You can set the start and end month for the extra
												payment. Your loan tenure is ${form.getValues("loanTermYears")} year(s) therefore the value for start and end month should be between 0 to ${maxMonthIndex}. If you want it to continue until the end of the
												loan term, leave the end month as -1.`}
											</AlertDescription>
										</Alert>
										<FormField
											control={form.control}
											name="extraPaymentStartMonth"
											render={({ field }) => (
												<div className="space-y-2">
													<FormLabel>Extra Payment Start Month</FormLabel>
													<Input
														{...field}
														type="number"
														onChange={(e) =>
															field.onChange(Number(e.target.value))
														}
													/>
													<FormMessage />
												</div>
											)}
										/>

										<FormField
											control={form.control}
											name="extraPaymentEndMonth"
											render={({ field }) => (
												<div className="space-y-2">
													<FormLabel>Extra Payment End Month</FormLabel>
													<Input
														{...field}
														type="number"
														onChange={(e) =>
															field.onChange(Number(e.target.value))
														}
													/>
													<FormMessage />
												</div>
											)}
										/>
									</>
								)}
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
