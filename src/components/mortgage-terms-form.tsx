"use client"

import { Button } from "@components/ui/button"
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle } from "@components/ui/drawer"
import { Form, FormField, FormLabel, FormMessage } from "@components/ui/form"
import { Input } from "@components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMemo } from "react"
import { useForm } from "react-hook-form"
import { AdvanceExtraPayment } from "@/components/advance-extra-payment"
import { BasicExtraPayment } from "@/components/basic-extra-payment"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useMortgage } from "@/context/mortgate-context"
import { calculateAmortizationSchedule } from "@/lib/amortization"
import { generatePaymentBlocksAdvance, generatePaymentBlocksBasic } from "@/lib/paymentBlocks"
import {
	advanceExtraPaymentSchema,
	basicExtraPaymentSchema,
	type MortgageTermsInputs,
	mortgageTermsInputsSchema,
} from "@/models"
import type { ExtraPayment } from "@/types"

function getDefaultValues(): MortgageTermsInputs {
	const loanTermYears = 35
	return {
		principalLoanAmount: 490000,
		loanTermYears,
		annualInterestRate: 3.8,
		investmentReturnRate: 5,
		// extraPayment: {
		// 	amount: 1000,
		// 	increment: 0,
		// 	incrementFrequency: "yearly",
		// 	startMonth: 0,
		// 	endMonth: loanTermYears > 0 ? loanTermYears * 12 - 1 : 0,
		// 	extraPaymentSplitRatio: 0.5, // Default split ratio for extra payments
		// },
		extraPayment: {
			paymentBlocks: [
				{
					startMonth: 0,
					endMonth: 119,
					amount: 200,
					splitRatio: 0.5,
				},
				{
					startMonth: 0,
					endMonth: 120,
					amount: 239,
					splitRatio: 0.5,
				},
				{
					startMonth: 0,
					endMonth: 240,
					amount: 359,
					splitRatio: 0.5,
				},
			],
		},
	}
}

export function MortgageTermsForm() {
	const {
		openMortgageTermsForm,
		setOpenMortgageTermsForm,
		setAmortizationDetails,
		setMortgageTerms,
		setSubmitted,
		isAdvanced,
		setIsAdvanced,
	} = useMortgage()

	const dynamicSchema = useMemo(() => {
		return mortgageTermsInputsSchema.extend({
			extraPayment: isAdvanced ? advanceExtraPaymentSchema : basicExtraPaymentSchema,
		})
	}, [isAdvanced])

	const form = useForm<MortgageTermsInputs>({
		resolver: zodResolver(dynamicSchema),
		defaultValues: getDefaultValues(),
	})

	const handleSubmitForm = form.handleSubmit((data) => {
		let paymentBlocks: ExtraPayment[] = []

		if (isAdvanced) {
			paymentBlocks = generatePaymentBlocksAdvance(data)
		} else {
			paymentBlocks = generatePaymentBlocksBasic(data)
		}

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
					<div className="flex flex-col gap-4 overflow-auto">
						<div className="flex flex-col lg:flex-row w-full gap-4">
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

						<div className="space-y-2">
							<div className="space-y-1">
								<Label>Extra Payment Mode</Label>
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
