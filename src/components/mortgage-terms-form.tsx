"use client"

import { Button } from "@components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card"
import { Form, FormField, FormLabel, FormMessage } from "@components/ui/form"
import { Input } from "@components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { InfoIcon } from "lucide-react"
import type React from "react"
import type { ReactNode } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { ModeToggle } from "@/components/mode-toggle"
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
import {
	HoverCard,
	HoverCardContent,
	HoverCardTrigger,
} from "@/components/ui/hover-card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Slider } from "@/components/ui/slider"
import { useMortgage } from "@/context/mortgate-context"
import { calculateAmortizationSchedule } from "@/lib/amortization"
import { ExtraPaymentIncrementFrequency } from "@/types"

function getDefaultValues(): MortgageTermsInputs {
	const loanTermYears = 0
	const extraPaymentEndMonth = loanTermYears > 0 ? loanTermYears * 12 - 1 : 0
	return {
		principalLoanAmount: 0,
		loanTermYears,
		annualInterestRate: 0,
		extraPayment: 0,
		extraPaymentIncrement: 0,
		extraPaymentIncrementFrequency: "yearly",
		extraPaymentStartMonth: 0,
		extraPaymentEndMonth,
		investmentReturnRate: 0,
		extraPaymentSplitRatio: 0.5, // Default split ratio for extra payments
	}
}

function ExtraPaymentInfoHoverCard({ children }: { children: ReactNode }) {
	return (
		<HoverCard>
			<HoverCardTrigger asChild>{children}</HoverCardTrigger>
			<HoverCardContent className="w-80 bg-primary">
				<p className="text-xs text-primary-foreground">
					Extra payments can significantly reduce the total interest paid over
					the life of the loan. You can specify the amount, frequency, and how
					much of the extra payment goes towards the principal versus
					investments.
				</p>
			</HoverCardContent>
		</HoverCard>
	)
}

export function MortgageTermsForm() {
	const { setMortgageTerms, setAmortizationDetails, setSubmitted } =
		useMortgage()

	const form = useForm<MortgageTermsInputs>({
		resolver: zodResolver(mortgageTermsInputsSchema),
		defaultValues: getDefaultValues(),
	})

	const maxMonthIndex = form.watch("loanTermYears") * 12 - 1

	const handleSubmitForm = form.handleSubmit((data) => {
		if (
			data.extraPaymentStartMonth < 0 ||
			data.extraPaymentStartMonth > maxMonthIndex
		) {
			const errorMessage = `Extra payment start month must be between 0 (inclusive) and ${maxMonthIndex} (inclusive)`
			toast.error(errorMessage)
			form.setError("extraPaymentStartMonth", {
				type: "manual",
				message: errorMessage,
			})
			return
		}

		if (
			data.extraPaymentEndMonth > maxMonthIndex ||
			data.extraPaymentEndMonth < data.extraPaymentStartMonth
		) {
			const errorMessage = `Extra payment end month must be between ${data.extraPaymentStartMonth} (inclusive) and ${maxMonthIndex} (inclusive)`
			toast.error(errorMessage)
			form.setError("extraPaymentEndMonth", {
				type: "manual",
				message: errorMessage,
			})
			return
		}

		console.log("Form submitted with data:", data)
		setMortgageTerms(data)
		toast.success("Amortization rates calculated successfully")

		const amortizationDetails = calculateAmortizationSchedule(data)
		setAmortizationDetails(amortizationDetails)
		setSubmitted(true)
	})

	const handleLoanTermChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const numOfMonths = Number(e.target.value) * 12
		form.setValue("loanTermYears", Number(e.target.value))

		form.setValue("extraPaymentStartMonth", 0)
		form.setValue("extraPaymentEndMonth", numOfMonths - 1)
	}

	const handleRatioChange = (value: number[]) => {
		const splitRatio = value[0]
		form.setValue("extraPaymentSplitRatio", splitRatio)

		const values = form.getValues()
		setMortgageTerms(values)

		const amortizationDetails = calculateAmortizationSchedule(values)
		setAmortizationDetails(amortizationDetails)
	}

	return (
		<Form {...form}>
			<Card className="w-full max-w-none sm:max-w-md lg:max-w-sm lg:h-full">
				<CardHeader>
					<CardTitle>Mortgage Terms</CardTitle>
				</CardHeader>
				<CardContent className="space-y-1">
					<FormField
						control={form.control}
						name="principalLoanAmount"
						render={({ field }) => (
							<div className="space-y-1">
								<FormLabel>Loan Amount</FormLabel>
								<Input
									{...field}
									type="number"
									onChange={(e) => field.onChange(Number(e.target.value))}
								/>
								<FormMessage />
							</div>
						)}
					/>

					<div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
						<FormField
							control={form.control}
							name="loanTermYears"
							render={({ field }) => (
								<div className="space-y-1">
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
								<div className="space-y-1">
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
					</div>

					<Accordion type="single" collapsible>
						<AccordionItem value="options">
							<AccordionTrigger>Options</AccordionTrigger>
							<AccordionContent className="space-y-2">
								<ExtraPaymentInfoHoverCard>
									<div className="flex items-center gap-2 bg-muted rounded p-1">
										<InfoIcon className="h-4- w-4" />
										<p className="text-primary">Extra Payment</p>
									</div>
								</ExtraPaymentInfoHoverCard>
								<div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
									<FormField
										control={form.control}
										name="extraPayment"
										render={({ field }) => (
											<div className="space-y-1">
												<FormLabel>Extra Payment</FormLabel>
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
										name="extraPaymentIncrement"
										render={({ field }) => (
											<div className="space-y-1">
												<FormLabel>Extra Payment Increment</FormLabel>
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
								</div>

								<FormField
									control={form.control}
									name="extraPaymentIncrementFrequency"
									render={({ field }) => (
										<div className="space-y-1">
											<FormLabel>Extra Payment Increment Frequency</FormLabel>
											<RadioGroup
												value={field.value}
												onValueChange={field.onChange}
												className="flex flex-col sm:flex-row flex-wrap gap-2"
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
										<div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
											<FormField
												control={form.control}
												name="extraPaymentStartMonth"
												render={({ field }) => (
													<div className="space-y-1">
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
													<div className="space-y-1">
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
										</div>

										<FormField
											control={form.control}
											name="investmentReturnRate"
											render={({ field }) => (
												<div className="space-y-1">
													<FormLabel>Investment Return Rate (%)</FormLabel>
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
											name="extraPaymentSplitRatio"
											render={({ field }) => (
												<>
													<FormLabel>
														Extra Payment Split Ratio for Investment (%)
													</FormLabel>
													<Label className="text-sm text-muted-foreground">
														This is the percentage of the extra payment that
														will be used to pay down the principal. The rest
														will be invested
													</Label>
													<div>
														<span>
															Principal Payment: {Math.round(field.value * 100)}
															%
														</span>
														<Slider
															{...field}
															min={0}
															max={1}
															step={0.01}
															value={[field.value]}
															onValueChange={handleRatioChange}
														/>
														<span>
															Investment: {Math.round((1 - field.value) * 100)}%
														</span>
													</div>
												</>
											)}
										/>
									</>
								)}
							</AccordionContent>
						</AccordionItem>
					</Accordion>

					<div className="flex flex-col sm:flex-row justify-between gap-2 sm:gap-2">
						<Button
							onClick={handleSubmitForm}
							type="button"
							className="w-full sm:w-auto"
						>
							Calculate
						</Button>
						<div className="flex justify-center sm:justify-end">
							<ModeToggle />
						</div>
					</div>
				</CardContent>
			</Card>
		</Form>
	)
}
