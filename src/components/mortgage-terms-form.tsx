"use client"

import { Button } from "@components/ui/button"
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle } from "@components/ui/drawer"
import { Form, FormField, FormLabel, FormMessage } from "@components/ui/form"
import { Input } from "@components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { AdvanceExtraPayment } from "@/components/advance-extra-payment"
import { BasicExtraPayment } from "@/components/basic-extra-payment"
import { type MortgageTermsInputs, mortgageTermsInputsSchema } from "@/components/models"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useMortgage } from "@/context/mortgate-context"
import { calculateAmortizationSchedule } from "@/lib/amortization"
import { generatePaymentBlocksBasic } from "@/lib/paymentBlocks"

function getDefaultValues(): MortgageTermsInputs {
	const loanTermYears = 35
	return {
		principalLoanAmount: 490000,
		loanTermYears,
		annualInterestRate: 3.8,
		investmentReturnRate: 0,
		extraPayment: {
			amount: 1000,
			increment: 0,
			incrementFrequency: "yearly",
			startMonth: 0,
			endMonth: loanTermYears > 0 ? loanTermYears * 12 - 1 : 0,
			extraPaymentSplitRatio: 0.5, // Default split ratio for extra payments
		},
	}
}

export function MortgageTermsForm() {
	const [isAdvanced, setIsAdvanced] = useState(false)
	const { openMortgageTermsForm, setOpenMortgageTermsForm, setAmortizationDetails, setMortgageTerms, setSubmitted } =
		useMortgage()

	const form = useForm<MortgageTermsInputs>({
		resolver: zodResolver(mortgageTermsInputsSchema),
		defaultValues: getDefaultValues(),
	})

	// const maxMonthIndex = form.watch("loanTermYears") * 12 - 1

	// const handleSubmitForm = form.handleSubmit((data) => {
	// 	if (data.extraPaymentStartMonth < 0 || data.extraPaymentStartMonth > maxMonthIndex) {
	// 		const errorMessage = `Extra payment start month must be between 0 (inclusive) and ${maxMonthIndex} (inclusive)`
	// 		toast.error(errorMessage)
	// 		form.setError("extraPaymentStartMonth", {
	// 			type: "manual",
	// 			message: errorMessage,
	// 		})
	// 		return
	// 	}

	// 	if (data.extraPaymentEndMonth > maxMonthIndex || data.extraPaymentEndMonth < data.extraPaymentStartMonth) {
	// 		const errorMessage = `Extra payment end month must be between ${data.extraPaymentStartMonth} (inclusive) and ${maxMonthIndex} (inclusive)`
	// 		toast.error(errorMessage)
	// 		form.setError("extraPaymentEndMonth", {
	// 			type: "manual",
	// 			message: errorMessage,
	// 		})
	// 		return
	// 	}

	// 	console.log("Form submitted with data:", data)

	// 	const newMortgageTerms = {
	// 		...mortgageTerms,
	// 		extraPayment: data,
	// 	}

	// 	setMortgageTerms({ ...mortgageTerms, extraPayment: data })
	// 	toast.success("Amortization rates calculated successfully")

	// 	const amortizationDetails = calculateAmortizationSchedule(newMortgageTerms)
	// 	setAmortizationDetails(amortizationDetails)
	// 	setSubmitted(true)
	// 	setOpenMortgageTermsForm(false)
	// })

	const handleSubmitForm = form.handleSubmit((data) => {
		const paymentBlocks = generatePaymentBlocksBasic(data)

		const amortizationDetails = calculateAmortizationSchedule(data, paymentBlocks)

		setAmortizationDetails(amortizationDetails)
		setMortgageTerms(data)
		setSubmitted(true)
		setOpenMortgageTermsForm(false)
	})

	return (
		<Drawer open={openMortgageTermsForm} onOpenChange={setOpenMortgageTermsForm}>
			<DrawerContent className="px-2">
				<DrawerHeader>
					<DrawerTitle>Mortgage Terms</DrawerTitle>
					<DrawerDescription></DrawerDescription>
				</DrawerHeader>

				<Form {...form}>
					{/* Base mortgage terms */}
					<div className="flex flex-col gap-4">
						<div className="flex flex-row w-full gap-4">
							<FormField
								control={form.control}
								name="principalLoanAmount"
								render={({ field }) => (
									<div className="space-y-1">
										<FormLabel>Loan Amount</FormLabel>
										<Input {...field} type="number" onChange={(e) => field.onChange(Number(e.target.value))} />
										<FormMessage />
									</div>
								)}
							/>

							<FormField
								control={form.control}
								name="loanTermYears"
								render={({ field }) => (
									<div className="space-y-1">
										<FormLabel>Loan Term (Years)</FormLabel>
										<Input {...field} type="number" onChange={(e) => field.onChange(Number(e.target.value))} />
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
										<Input {...field} type="number" onChange={(e) => field.onChange(Number(e.target.value))} />
										<FormMessage />
									</div>
								)}
							/>

							<FormField
								control={form.control}
								name="investmentReturnRate"
								render={({ field }) => (
									<div className="space-y-1">
										<FormLabel>Investment Return Rate (%)</FormLabel>
										<Input {...field} type="number" onChange={(e) => field.onChange(Number(e.target.value))} />
										<FormMessage />
									</div>
								)}
							/>
						</div>

						<div className="grid grid-cols-3 gap-4">
							<div className="col-span-3 space-y-1">
								<Label>Extra Payment</Label>
								<div className="flex flex-row items-center gap-2 text-sm">
									<span>Basic</span>
									<Switch checked={isAdvanced} onCheckedChange={setIsAdvanced} />
									<span>Advance</span>
								</div>
							</div>

							{isAdvanced ? <AdvanceExtraPayment /> : <BasicExtraPayment />}
						</div>
					</div>
				</Form>
				<div className="w-full my-4">
					<Button onClick={handleSubmitForm} type="button" className="w-full">
						Calculate
					</Button>
				</div>
			</DrawerContent>
		</Drawer>
	)
}
