"use client"

import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { useMortgage } from "@/context/mortgate-context"
import { calculateAmortizationSchedule } from "@/lib/amortization"

export function SplitRatio() {
	const { setMortgageTerms, mortgageTerms, setAmortizationDetails, submitted } =
		useMortgage()

	if (!mortgageTerms.principalLoanAmount || !submitted) {
		return null
	}

	const handleRatioChange = (value: number[]) => {
		const splitRatio = value[0]

		setMortgageTerms({ ...mortgageTerms, extraPaymentSplitRatio: splitRatio })

		const amortizationDetails = calculateAmortizationSchedule(mortgageTerms)
		setAmortizationDetails(amortizationDetails)
	}

	const principalPercentage = Math.round(
		mortgageTerms.extraPaymentSplitRatio * 100,
	)
	const investmentPercentage = Math.round(
		(1 - mortgageTerms.extraPaymentSplitRatio) * 100,
	)

	return (
		<div className="w-full max-w-2xl mx-auto space-y-4">
			<div>
				<Label className="text-base font-medium">
					Extra Payment Split Ratio
				</Label>
				<Label className="text-sm text-muted-foreground">
					Choose how to split your extra payment between principal and
					investment
				</Label>
			</div>

			<div className="space-y-4">
				<div className="flex items-center justify-between text-sm font-medium">
					<span className="text-blue-600">
						Principal Payment: {principalPercentage}%
					</span>
					<span className="text-green-600">
						Investment: {investmentPercentage}%
					</span>
				</div>

				<div className="px-2">
					<Slider
						min={0}
						max={1}
						step={0.01}
						value={[mortgageTerms.extraPaymentSplitRatio]}
						onValueChange={handleRatioChange}
						className="w-full"
					/>
				</div>

				{/* <div className="flex items-center justify-between text-xs text-muted-foreground">
					<span>0% Principal</span>
					<span>100% Principal</span>
				</div> */}
			</div>
		</div>
	)
}
