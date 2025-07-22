"use client"

import { useEffect, useState } from "react"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { useMortgage } from "@/context/mortgate-context"
import { useDebounce } from "@/hooks/useDebounce"
import { calculateAmortizationSchedule } from "@/lib/amortization"
import { generatePaymentBlocksBasic } from "@/lib/paymentBlocks"
import type { BasicExtraPaymentInputs, MortgageTermsInputs } from "@/models"

type BasicSplitRatioProps = {
	splitRatio: number
}

export function BasicSplitRatio({ splitRatio }: BasicSplitRatioProps) {
	const { setMortgageTerms, mortgageTerms, setAmortizationDetails, submitted } = useMortgage()

	const [ratio, setRatio] = useState<number>(splitRatio)
	const debouncedSplitRatio = useDebounce(ratio, 500)

	useEffect(() => {
		setRatio(splitRatio)
	}, [splitRatio])

	// biome-ignore lint/correctness/useExhaustiveDependencies: Adding other values will cause the calculation to run before the mortgage terms are set which can lead to reading null values and thus crashing the app
	useEffect(() => {
		if (typeof debouncedSplitRatio === "number" && mortgageTerms.principalLoanAmount && submitted) {
			const updatedMorgageTerms: MortgageTermsInputs = {
				...mortgageTerms,
				extraPayment: {
					...mortgageTerms.extraPayment,
					extraPaymentSplitRatio: debouncedSplitRatio,
				},
			}

			setMortgageTerms(updatedMorgageTerms)

			const paymentBlocks = generatePaymentBlocksBasic(updatedMorgageTerms)

			const updatedSchedule = calculateAmortizationSchedule(updatedMorgageTerms, paymentBlocks)

			setAmortizationDetails(updatedSchedule)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [debouncedSplitRatio])

	if (!mortgageTerms.principalLoanAmount || !submitted) {
		return null
	}

	const principalPercentage = Math.round(ratio * 100)
	const investmentPercentage = Math.round((1 - ratio) * 100)

	const handleSplitRatioChange = (value: number[]) => {
		setRatio(value[0])
	}

	return (
		<div className="w-full max-w-2xl mx-auto space-y-4">
			<div>
				<Label className="text-base font-medium">Extra Payment Split Ratio</Label>
				<Label className="text-sm text-muted-foreground">
					Play around with the slider to see how spreading your extra payment between principal and investment affects
					your amortization rate.
				</Label>
			</div>

			<div className="space-y-4">
				<div className="flex items-center justify-between text-sm font-medium">
					<span className="text-green-600">Investment: {investmentPercentage}%</span>
					<span className="text-blue-600">Principal Payment: {principalPercentage}%</span>
				</div>

				<div className="px-2">
					<Slider
						min={0}
						max={1}
						step={0.01}
						value={[ratio]}
						onValueChange={handleSplitRatioChange}
						className="w-full"
					/>
				</div>
			</div>
		</div>
	)
}
