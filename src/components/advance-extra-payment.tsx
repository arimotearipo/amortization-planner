import { zodResolver } from "@hookform/resolvers/zod"
import { Plus, X } from "lucide-react"
import { useFieldArray, useForm, useFormContext } from "react-hook-form"
import z from "zod"
import type { MortgageTermsInputs } from "@/components/models"
import { Button } from "@/components/ui/button"
import { Form, FormField, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Slider } from "@/components/ui/slider"
import type { PaymentBlock } from "@/types"

const paymentBlockSchema = z
	.object({
		amount: z.number().min(0, "Amount must be greater than 0"),
		startMonth: z.number().int("Start month must be an integer").min(0, "Start month cannot be negative"),
		endMonth: z.number().int("End month must be an integer").min(1, "End month must be greater than 0"),
		splitRatio: z.number().min(0, "Split ratio must be between 0 and 1").max(1, "Split ratio must be between 0 and 1"),
	})
	.check((ctx) => {
		if (ctx.value.endMonth <= ctx.value.startMonth) {
			ctx.issues.push({
				code: "too_small",
				minimum: ctx.value.startMonth + 1,
				origin: "int",
				input: ctx.value.endMonth,
				message: "End month must be greater than start month.",
			})
		}
	})

export function AdvanceExtraPayment() {
	// Local state for new block

	const form = useForm<PaymentBlock>({
		resolver: zodResolver(paymentBlockSchema),
		defaultValues: {
			amount: 0,
			startMonth: 0,
			endMonth: 0,
			splitRatio: 0.5, // Default split ratio for extra payments
		},
	})

	const formContext = useFormContext<MortgageTermsInputs>()

	const { fields, remove, append } = useFieldArray({
		control: formContext.control,
		name: "extraPayment.paymentBlocks",
	})

	const handleAddBlock = form.handleSubmit((newBlock) => {
		// Validation: startMonth of current block >= endMonth of previous block
		if (fields.length > 0) {
			const prevEndMonth = formContext.getValues(`extraPayment.paymentBlocks.${fields.length - 1}.endMonth`)
			if (newBlock.startMonth < prevEndMonth) {
				form.setError("startMonth", {
					message: `Start month must be at least the end month of previous block (${prevEndMonth}).`,
				})
				return
			}
		}

		append(newBlock)
		form.reset({
			amount: newBlock.amount, // Keep the same amount for the next block
			startMonth: newBlock.endMonth + 1, // Reset start month to next month
			endMonth: newBlock.endMonth + 2, // Reset end month to next month
		})
	})

	const reversedFields = [...fields].reverse()

	const maxYearIndex = formContext.watch("loanTermYears") * 12 - 1

	return (
		<Form {...form}>
			<div className="flex flex-col animate-in fade-in duration-500">
				<div className="w-full">Add Payment Block</div>
				<div className="flex flex-col lg:flex-row w-full gap-2">
					<div className="w-full">
						<FormField
							control={form.control}
							name="amount"
							render={({ field }) => (
								<div className="flex flex-col">
									<FormLabel className="text-xs mb-1">Amount</FormLabel>
									<Input {...field} onChange={(e) => field.onChange(Number(e.target.value))} placeholder="Amount" />
									<FormMessage />
								</div>
							)}
						/>

						<FormField
							control={form.control}
							name="startMonth"
							render={({ field }) => (
								<div className="flex flex-col">
									<Label htmlFor="startMonth" className="text-xs mb-1">
										Start Month (inclusive)
									</Label>
									<Input
										{...field}
										onChange={(e) => field.onChange(Number(e.target.value))}
										placeholder="Start month index"
									/>
									<FormMessage />
								</div>
							)}
						/>

						<FormField
							control={form.control}
							name="endMonth"
							render={({ field }) => (
								<div className="flex flex-col">
									<FormLabel className="text-xs mb-1">End Month (exclusive)</FormLabel>
									<Input
										{...field}
										onChange={(e) => field.onChange(Number(e.target.value))}
										placeholder={`Max ${maxYearIndex}`}
									/>
									<FormMessage />
								</div>
							)}
						/>

						<FormField
							control={form.control}
							name="splitRatio"
							render={({ field }) => (
								<div className="flex flex-col">
									<Label htmlFor="endMonth" className="text-xs mb-1">
										Ratio between Principal and Investment
									</Label>
									<div className="flex flex-col">
										<span className="text-sm">{`Principal Payment ${Math.round(field.value * 100)}%`}</span>
										<Slider
											min={0}
											max={1}
											step={0.01}
											value={[field.value]}
											onValueChange={(value) => form.setValue("splitRatio", value[0])}
											className="col-span-8"
										/>
										<span className="text-sm">{`Investment Payment ${Math.round((1 - field.value) * 100)}%`}</span>
									</div>
								</div>
							)}
						/>

						<div className="flex items-center justify-center">
							<Button type="submit" size="sm" onClick={handleAddBlock} className="w-full">
								<Plus size={16} />
								Add
							</Button>
						</div>
					</div>
					<div className="w-full rounded bg-muted/50 p-2">
						<div className="text-base font-semibold mb-2">Payment Blocks</div>
						<ScrollArea className="w-full h-auto">
							{fields.length === 0 ? (
								<div className="text-muted-foreground text-xs">No payment blocks added yet.</div>
							) : (
								<div className="flex flex-col gap-2">
									{reversedFields.map((field, reversedIndex) => {
										const index = fields.length - 1 - reversedIndex

										const principalPortion = (
											formContext.getValues(`extraPayment.paymentBlocks.${index}.splitRatio`) * 100
										).toFixed(2)

										const investmentPortion = (
											(1 - formContext.getValues(`extraPayment.paymentBlocks.${index}.splitRatio`)) *
											100
										).toFixed(2)

										return (
											<div
												key={field.id}
												className="flex flex-row items-center gap-2 border rounded px-2 py-1 bg-background"
											>
												<span className="font-semibold text-primary text-xs">#{fields.length - reversedIndex}</span>
												<span className="text-xs">
													<span className="font-bold">Amount:</span>{" "}
													{formContext.watch(`extraPayment.paymentBlocks.${index}.amount`)}
												</span>
												<span className="text-xs">
													<span className="font-bold">Start:</span>{" "}
													{formContext.watch(`extraPayment.paymentBlocks.${index}.startMonth`)}
												</span>
												<span className="text-xs">
													<span className="font-bold">End:</span>{" "}
													{formContext.watch(`extraPayment.paymentBlocks.${index}.endMonth`)}
												</span>
												<span className="text-xs">
													<span className="font-bold">Split Ratio:</span> Principal: {principalPortion}%, Investment:{" "}
													{investmentPortion}%
												</span>
												{index === fields.length - 1 && (
													<Button
														variant="destructiveGhost"
														size="xs"
														type="button"
														className="px-2 ml-auto"
														onClick={() => remove(index)}
													>
														<X className="h-2 w-2" />
													</Button>
												)}
											</div>
										)
									})}
								</div>
							)}
						</ScrollArea>
					</div>
				</div>
			</div>
		</Form>
	)
}
