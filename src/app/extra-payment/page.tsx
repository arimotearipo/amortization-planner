"use client"

import { Plus, X } from "lucide-react"
import { useState } from "react"
import { useFieldArray, useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"

type Payment = {
	month: number
	amount: number
	splitRatio: number // portion to go towards principal payment
}

type PaymentBlock = {
	amount: number
	startMonth: number
	endMonth: number
	splitRatio: number // portion to go towards principal payment
}

type ExtraPaymentBlocksForm = {
	paymentBlocks: PaymentBlock[]
}

export default function ExtraPaymentPage() {
	const form = useForm<ExtraPaymentBlocksForm>({
		defaultValues: {
			paymentBlocks: [],
		},
	})

	const { fields, remove, append } = useFieldArray({
		control: form.control,
		name: "paymentBlocks",
	})

	// Local state for new block
	const [newBlock, setNewBlock] = useState<PaymentBlock>({
		amount: 0,
		startMonth: 0,
		endMonth: 0,
		splitRatio: 0.5,
	})
	const [error, setError] = useState<string | null>(null)

	const handleAddBlock = () => {
		console.log("Adding block:", newBlock)
		setError(null)
		if (newBlock.endMonth <= newBlock.startMonth) {
			console.log("endMonth", newBlock.endMonth, "startMonth", newBlock.startMonth)
			setError("End month must be greater than start month.")
			return
		}
		if (newBlock.amount <= 0 || newBlock.startMonth < 0) {
			setError("Please enter valid values for all fields.")
			return
		}
		// Validation: startMonth of current block >= endMonth of previous block
		if (fields.length > 0) {
			const prevEndMonth = form.getValues(`paymentBlocks.${fields.length - 1}.endMonth`)
			if (newBlock.startMonth < prevEndMonth) {
				setError(`Start month must be at least the end month of previous block (${prevEndMonth}).`)
				return
			}
		}

		append(newBlock)

		setNewBlock({ amount: 0, startMonth: 0, endMonth: 0, splitRatio: 0.5 })
	}

	const handleCalculate = () => {
		// TODO: remove this hardcoded loan duration
		const LOAN_DURATION = 35 * 12

		const EMPTY_PAYMENT: Payment = {
			month: 0,
			amount: 0,
			splitRatio: 0, // split Ratio does not matter for empty payments
		}

		const paymentBlocks = form.getValues("paymentBlocks")

		const spreadedPaymentBlocks: Payment[] = []
		for (const block of paymentBlocks) {
			for (let month = block.startMonth; month < block.endMonth; month++) {
				spreadedPaymentBlocks.push({
					month,
					amount: block.amount,
					splitRatio: block.splitRatio,
				})
			}
		}

		// fullPaymentBlocks will contain the full payment blocks for each month from 0 to LOAN_DURATION
		const fullPaymentBlocks: Payment[] = [] // this is what we returns
		for (let month = 0; month < LOAN_DURATION; month++) {
			const foundPayment = spreadedPaymentBlocks.find((p) => month === p.month)

			if (!foundPayment) {
				fullPaymentBlocks.push({ ...EMPTY_PAYMENT, month })
			} else {
				fullPaymentBlocks.push(foundPayment)
			}
		}

		const missingMonths = []
		const allMonths = fullPaymentBlocks.map((block) => block.month)
		for (let month = 0; month < LOAN_DURATION; month++) {
			if (!allMonths.includes(month)) {
				missingMonths.push(month)
			}
		}

		return fullPaymentBlocks
	}

	const reversedFields = [...fields].reverse()

	return (
		<Form {...form}>
			<div className="mb-3 p-2 rounded border bg-muted/50">
				<div className="text-base font-semibold mb-2">Add Payment Block</div>
				<div className="grid grid-cols-5 gap-2">
					<div className="flex flex-col">
						<Label htmlFor="amount" className="text-xs mb-1">
							Amount
						</Label>
						<Input
							id="amount"
							type="number"
							value={newBlock.amount}
							onChange={(e) => setNewBlock({ ...newBlock, amount: Number(e.target.value) })}
							min={0}
							placeholder="Amount"
						/>
					</div>
					<div className="flex flex-col">
						<Label htmlFor="startMonth" className="text-xs mb-1">
							Start Month (inclusive)
						</Label>
						<Input
							id="startMonth"
							type="number"
							value={newBlock.startMonth}
							onChange={(e) => setNewBlock({ ...newBlock, startMonth: Number(e.target.value) })}
							min={0}
							placeholder="Start"
						/>
					</div>
					<div className="flex flex-col">
						<Label htmlFor="endMonth" className="text-xs mb-1">
							End Month (exclusive)
						</Label>
						<Input
							id="endMonth"
							type="number"
							value={newBlock.endMonth}
							onChange={(e) => setNewBlock({ ...newBlock, endMonth: Number(e.target.value) })}
							min={0}
							placeholder="End"
						/>
					</div>
					<div className="flex flex-col">
						<Label htmlFor="endMonth" className="text-xs mb-1">
							Ratio between Principal and Investment
						</Label>
						<div className="flex flex-col">
							<span className="text-sm">{`Principal Payment ${Math.round(newBlock.splitRatio * 100)}%`}</span>
							<Slider
								min={0}
								max={1}
								step={0.01}
								value={[newBlock.splitRatio]}
								onValueChange={(value) => setNewBlock({ ...newBlock, splitRatio: value[0] })}
								className="col-span-8"
							/>
							<span className="text-sm">{`Investment Payment ${Math.round((1 - newBlock.splitRatio) * 100)}%`}</span>
						</div>
					</div>
					<div className="flex items-center justify-center">
						<Button type="submit" size="sm" onClick={handleAddBlock}>
							<Plus size={16} />
							Add
						</Button>
					</div>
				</div>
				{error && <div className="text-red-500 mt-1 text-xs">{error}</div>}
				{fields.length > 0 && (
					<div className="w-full flex justify-center">
						<Button variant={"default"} onClick={handleCalculate}>
							Calculate
						</Button>
					</div>
				)}
			</div>
			<div className="p-2 rounded border bg-muted/50">
				<div className="text-base font-semibold mb-2">Payment Blocks</div>
				{fields.length === 0 ? (
					<div className="text-muted-foreground text-xs">No payment blocks added yet.</div>
				) : (
					<div className="flex flex-col gap-2">
						{reversedFields.map((field, reversedIndex) => {
							const index = fields.length - 1 - reversedIndex

							const principalPortion = (form.getValues(`paymentBlocks.${index}.splitRatio`) * 100).toFixed(2)

							const investmentPortion = ((1 - form.getValues(`paymentBlocks.${index}.splitRatio`)) * 100).toFixed(2)

							return (
								<div key={field.id} className="flex flex-row items-center gap-2 border rounded px-2 py-1 bg-background">
									<span className="font-semibold text-primary text-xs">#{fields.length - reversedIndex}</span>
									<span className="text-xs">
										<span className="font-bold">Amount:</span> {form.watch(`paymentBlocks.${index}.amount`)}
									</span>
									<span className="text-xs">
										<span className="font-bold">Start:</span> {form.watch(`paymentBlocks.${index}.startMonth`)}
									</span>
									<span className="text-xs">
										<span className="font-bold">End:</span> {form.watch(`paymentBlocks.${index}.endMonth`)}
									</span>
									<span className="text-xs">
										<span className="font-bold">Split Ratio:</span> Principal: {principalPortion}%, Investment:{" "}
										{investmentPortion}%
									</span>
									{index === fields.length - 1 && (
										<Button
											variant="destructive"
											size="sm"
											type="button"
											className="px-2 py-1 ml-auto"
											onClick={() => remove(index)}
										>
											<X />
										</Button>
									)}
								</div>
							)
						})}
					</div>
				)}
			</div>
		</Form>
	)
}
