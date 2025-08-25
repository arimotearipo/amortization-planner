"use client"

import { useEffect, useState } from "react"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { useMortgage } from "@/context/mortgate-context"
import { useDebounce } from "@/hooks/useDebounce"
import { calculateAmortizationSchedule } from "@/lib/amortization"
import { generatePaymentBlocksAdvance } from "@/lib/paymentBlocks"
import type { AdvanceExtraPaymentInputs } from "@/models"
import type { PaymentBlock } from "@/types"

type SplitRatioProps = {
	splitRatio: number
	onRatioChange: (blockNumber: number, ratio: number) => void
	blockNumber: number
	amount: number
	startMonth: number
	endMonth: number
}

// render individual split ratio item
function SplitRatioItem({ splitRatio, onRatioChange, blockNumber, amount, startMonth, endMonth }: SplitRatioProps) {
	const principalPercentage = Math.round(splitRatio * 100)
	const investmentPercentage = Math.round((1 - splitRatio) * 100)

	const handleSplitRatioChange = (value: number[]) => {
		onRatioChange(blockNumber, value[0])
	}

	return (
		<div>
			<span className="text-sm">Block #{blockNumber + 1}</span>
			<div className="flex flex-row gap-x-2">
				<span className="text-xs">Amount: {amount}</span>
				<span className="text-xs">Start Month: {startMonth}</span>
				<span className="text-xs">End Month: {endMonth}</span>
			</div>
			<div className="flex items-center justify-between text-xs font-medium lg:gap-x-4">
				<span className="text-green-600">Investment: {investmentPercentage}%</span>
				<span className="text-blue-600">Principal Payment: {principalPercentage}%</span>
			</div>

			<div className="px-4 md:px-2 my-1">
				<Slider
					min={0}
					max={1}
					step={0.01}
					value={[splitRatio]}
					onValueChange={handleSplitRatioChange}
					className="w-full"
				/>
			</div>
		</div>
	)
}

type AdvanceSplitRatioProps = {
	paymentBlocks: PaymentBlock[]
}

export function AdvanceSplitRatio({ paymentBlocks }: AdvanceSplitRatioProps) {
	const { mortgageTerms, setAmortizationDetails } = useMortgage()
	const [ratios, setRatios] = useState(paymentBlocks.map((block) => block.splitRatio))
	const debouncedRatios = useDebounce(ratios, 500)

	// biome-ignore lint/correctness/useExhaustiveDependencies: we only strictly want to run this when the ratios change
	useEffect(() => {
		const newExtraPayment = {
			...mortgageTerms.extraPayment,
		} as AdvanceExtraPaymentInputs

		newExtraPayment.paymentBlocks = newExtraPayment.paymentBlocks.map((blocks, idx) => ({
			...blocks,
			splitRatio: ratios[idx] ?? blocks.splitRatio,
		}))

		const newMortgageTermsInputs = {
			...mortgageTerms,
			extraPayment: newExtraPayment,
		}

		const generatedPaymentBlocks = generatePaymentBlocksAdvance(newMortgageTermsInputs)
		const newAmortizationDetails = calculateAmortizationSchedule(newMortgageTermsInputs, generatedPaymentBlocks)
		setAmortizationDetails(newAmortizationDetails)
	}, [debouncedRatios])

	const handleSplitRatioChange = (blockNumber: number, newRatio: number) => {
		setRatios((prev) => {
			const updated = [...prev]
			updated[blockNumber] = newRatio
			return updated
		})
	}

	return (
		<div className="flex flex-col space-y-4 w-full">
			<div className="w-full flex flex-col items-center">
				<Label className="text-base font-medium">Extra Payment Split Ratio</Label>
				<Label className="text-sm text-muted-foreground">
					Play around with the slider to see how spreading your extra payment between principal and investment affects
					your amortization rate.
				</Label>
			</div>
			<div className="flex flex-col lg:flex-row space-y-1 w-full justify-around">
				{paymentBlocks.map((block, index) => (
					<SplitRatioItem
						key={`${block.startMonth}-${block.endMonth}`}
						onRatioChange={handleSplitRatioChange}
						splitRatio={ratios[index]}
						blockNumber={index}
						amount={block.amount}
						startMonth={block.startMonth}
						endMonth={block.endMonth}
					/>
				))}
			</div>
		</div>
	)
}
