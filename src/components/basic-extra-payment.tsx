import { InfoIcon } from "lucide-react"
import { useFormContext } from "react-hook-form"
import {
	EndMonthFormInfoHoverCard,
	ExtraPaymentFormInfoHoverCard,
	StartMonthFormInfoHoverCard,
} from "@/components/hover-cards"
import type { MortgageTermsInputs } from "@/components/models"
import { Form, FormField, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Slider } from "@/components/ui/slider"
import { ICON_SIZE } from "@/consts"
import { ExtraPaymentIncrementFrequency } from "@/types"

export function BasicExtraPayment() {
	const form = useFormContext<MortgageTermsInputs>()

	const handleRatioChange = (value: number[]) => {
		const splitRatio = value[0]
		form.setValue("extraPayment.extraPaymentSplitRatio", splitRatio)
	}

	const maxYearIndex = form.watch("loanTermYears") * 12 - 1

	return (
		<Form {...form}>
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-4 animate-in fade-in duration-500">
				<FormField
					control={form.control}
					name="extraPayment.amount"
					render={({ field }) => (
						<div className="space-y-1">
							<FormLabel>
								Extra Payment{" "}
								<ExtraPaymentFormInfoHoverCard>
									<InfoIcon size={ICON_SIZE} />
								</ExtraPaymentFormInfoHoverCard>
							</FormLabel>

							<Input {...field} type="number" onChange={(e) => field.onChange(Number(e.target.value))} />
							<FormMessage />
						</div>
					)}
				/>

				<FormField
					control={form.control}
					name="extraPayment.increment"
					render={({ field }) => (
						<div className="space-y-1">
							<FormLabel>Extra Payment Increment</FormLabel>
							<Input {...field} type="number" onChange={(e) => field.onChange(Number(e.target.value))} />
							<FormMessage />
						</div>
					)}
				/>

				<FormField
					control={form.control}
					name="extraPayment.incrementFrequency"
					render={({ field }) => (
						<div className="space-y-1">
							<FormLabel>Extra Payment Increment Frequency</FormLabel>
							<RadioGroup
								value={field.value}
								onValueChange={field.onChange}
								className="flex flex-col sm:flex-row flex-wrap gap-2 items-center h-9"
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

				<FormField
					control={form.control}
					name="extraPayment.startMonth"
					render={({ field }) => (
						<div className="space-y-1">
							<FormLabel>
								Extra Payment Start Month{" "}
								<StartMonthFormInfoHoverCard endMonth={form.watch("loanTermYears") * 12 - 1}>
									<InfoIcon size={ICON_SIZE} />
								</StartMonthFormInfoHoverCard>
							</FormLabel>
							<Input {...field} type="number" onChange={(e) => field.onChange(Number(e.target.value))} />
							<FormMessage />
						</div>
					)}
				/>

				<FormField
					control={form.control}
					name="extraPayment.endMonth"
					render={({ field }) => (
						<div className="space-y-1">
							<FormLabel>
								Extra Payment End Month{" "}
								<EndMonthFormInfoHoverCard
									startMonth={form.watch("extraPayment.startMonth")}
									endMonth={form.watch("extraPayment.endMonth")}
								>
									<InfoIcon size={ICON_SIZE} />
								</EndMonthFormInfoHoverCard>
							</FormLabel>
							<Input
								{...field}
								type="number"
								onChange={(e) => field.onChange(Number(e.target.value))}
								placeholder={`Max ${maxYearIndex}`}
							/>
							<FormMessage />
						</div>
					)}
				/>

				<FormField
					control={form.control}
					name="extraPayment.extraPaymentSplitRatio"
					render={({ field }) => (
						<div className="col-span-1 lg:col-span-3 space-y-1">
							<FormLabel>Extra Payment Split Ratio for Investment (%)</FormLabel>
							<Label className="text-sm text-muted-foreground">
								This is the percentage of the extra payment that will be used to pay down the principal. The rest will
								be invested
							</Label>
							<div>
								<span>Principal Payment: {Math.round(field.value * 100)}%</span>
								<Slider
									{...field}
									min={0}
									max={1}
									step={0.01}
									value={[field.value]}
									onValueChange={handleRatioChange}
								/>
								<span>Investment: {Math.round((1 - field.value) * 100)}%</span>
							</div>
						</div>
					)}
				/>
			</div>
		</Form>
	)
}
