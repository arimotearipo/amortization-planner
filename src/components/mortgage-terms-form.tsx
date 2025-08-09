"use client"

import { Button } from "@components/ui/button"
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle } from "@components/ui/drawer"
import { Form, FormField, FormLabel, FormMessage } from "@components/ui/form"
import { Input } from "@components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { DialogTrigger } from "@radix-ui/react-dialog"
import { driver } from "driver.js"
import { useEffect, useMemo } from "react"
import { useForm } from "react-hook-form"
import { AdvanceExtraPayment } from "@/components/advance-extra-payment"
import { BasicExtraPayment } from "@/components/basic-extra-payment"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { BASIC_EXTRA_PAYMENT_IDS, MORTGATE_TERM_IDS } from "@/consts"
import { useAppStatus } from "@/context/app-status-context"
import { useDriver } from "@/context/driver-context"
import { useMortgage } from "@/context/mortgate-context"
import { calculateAmortizationSchedule } from "@/lib/amortization"
import { ADVANCE_DEFAULT_VALUES, BASIC_DEFAULT_VALUES } from "@/lib/config"
import { generatePaymentBlocksAdvance, generatePaymentBlocksBasic } from "@/lib/paymentBlocks"
import {
	advanceExtraPaymentSchema,
	basicExtraPaymentSchema,
	type MortgageTermsInputs,
	mortgageTermsInputsSchema,
} from "@/models"
import type { ExtraPayment } from "@/types"

export function MortgageTermsForm() {
	const { mortgateTermDone, setMortgageTermDone } = useDriver()
	const {
		openMortgageTermsForm,
		setOpenMortgageTermsForm,
		setAmortizationDetails,
		setMortgageTerms,
		isAdvanced,
		setIsAdvanced,
	} = useMortgage()

	const { setSubmitted } = useAppStatus()

	const dynamicSchema = useMemo(() => {
		return mortgageTermsInputsSchema.extend({
			extraPayment: isAdvanced ? advanceExtraPaymentSchema : basicExtraPaymentSchema,
		})
	}, [isAdvanced])

	const form = useForm<MortgageTermsInputs>({
		resolver: zodResolver(dynamicSchema),
		defaultValues: isAdvanced ? ADVANCE_DEFAULT_VALUES : BASIC_DEFAULT_VALUES,
	})

	// biome-ignore lint/correctness/useExhaustiveDependencies: not needed
	useEffect(() => {
		if (mortgateTermDone) {
			return
		}

		const driverObj = driver({
			steps: [
				// mortgage term
				{
					element: `#${MORTGATE_TERM_IDS.loanAmount}`,
					popover: {
						title: "Loan Amount",
						description: "Enter the amount that you borrowed for the mortgage.",
					},
				},
				{
					element: `#${MORTGATE_TERM_IDS.loanTerm}`,
					popover: {
						title: "Loan Term (Years)",
						description: "Specify the duration of your mortgage in years.",
					},
				},
				{
					element: `#${MORTGATE_TERM_IDS.annualInterestRate}`,
					popover: {
						title: "Annual Interest Rate",
						description: "Input the annual interest rate for your mortgage.",
					},
				},
				{
					element: `#${MORTGATE_TERM_IDS.investmentReturnRate}`,
					popover: {
						title: "Investment Return Rate",
						description: "Set the expected return rate on investments.",
					},
				},

				// step 4: basic extra payment form
				{
					element: `#${BASIC_EXTRA_PAYMENT_IDS.basicExtraPaymentAmount}`,
					popover: {
						title: "Extra Payment Amount",
						description:
							"Enter the extra amount of money you want to fork out each month to pay off your mortgage faster. This amount can either be pushed towards reducing your principal or invested.",
					},
				},
				{
					element: `#${BASIC_EXTRA_PAYMENT_IDS.basicExtraPaymentIncrement}`,
					popover: {
						title: "Extra Payment Increment",
						description: "Specify the increment for the extra payment. If you don't plan to increase it, set it to 0.",
					},
				},
				{
					element: `#${BASIC_EXTRA_PAYMENT_IDS.basicExtraPaymentIncrementFrequency}`,
					popover: {
						title: "Extra Payment Increment Frequency",
						description: "Select the frequency for the extra payment increment.",
					},
				},
				{
					element: `#${BASIC_EXTRA_PAYMENT_IDS.basicExtraPaymentStartMonth}`,
					popover: {
						title: "Extra Payment Start Month",
						description:
							"Choose the month when the extra payments will start. The month is 0-indexed (0 = first month).",
					},
				},
				{
					element: `#${BASIC_EXTRA_PAYMENT_IDS.basicExtraPaymentEndMonth}`,
					popover: {
						title: "Extra Payment End Month",
						description:
							"Select the month when the extra payments will stop. There will be no extra payment made on this month and onwards.",
					},
				},
				{
					element: `#${BASIC_EXTRA_PAYMENT_IDS.basicExtraPaymentSplitRatio}`,
					popover: {
						title: "Extra Payment Split Ratio",
						description:
							"Set the ratio for how the extra payment is split between mortgage and investment. Default is 50-50.",
					},
				},
				// step 11: advance extra payment form
				{
					element: `#${MORTGATE_TERM_IDS.modeSwitch}`,
					popover: {
						title: "Extra Payment Mode",
						description: "Toggle between Basic and Advance modes for extra payments.",
					},
				},
			],
			onDestroyed: () => {
				setMortgageTermDone(true)
			},
		})

		setTimeout(() => {
			driverObj.drive()
		}, 500)
	}, [mortgateTermDone])

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
		setOpenMortgageTermsForm(false)
		setSubmitted(true)
	})

	// checked === true is advance mode
	const handleModeChange = (checked: boolean) => {
		if (checked) {
			form.reset(ADVANCE_DEFAULT_VALUES)
		} else {
			form.reset(BASIC_DEFAULT_VALUES)
		}
		setIsAdvanced(checked)
	}

	return (
		<Drawer open={openMortgageTermsForm} onOpenChange={setOpenMortgageTermsForm}>
			<DialogTrigger asChild>
				<Button variant="default">Edit Mortgage Terms</Button>
			</DialogTrigger>
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
									<div className="space-y-1" id={MORTGATE_TERM_IDS.loanAmount}>
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
									<div className="space-y-1" id={MORTGATE_TERM_IDS.loanTerm}>
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
									<div className="space-y-1" id={MORTGATE_TERM_IDS.annualInterestRate}>
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
									<div className="space-y-1" id={MORTGATE_TERM_IDS.investmentReturnRate}>
										<FormLabel>Investment Return Rate (%)</FormLabel>
										<Input {...field} type="number" onChange={(e) => field.onChange(Number(e.target.value))} />
										<FormMessage />
									</div>
								)}
							/>
						</div>

						<div className="space-y-2">
							<div className="space-y-1" id={MORTGATE_TERM_IDS.modeSwitch}>
								<Label>Extra Payment Mode</Label>
								<div className="flex flex-row items-center gap-2 text-sm">
									<span>Basic</span>
									<Switch checked={isAdvanced} onCheckedChange={handleModeChange} />
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
