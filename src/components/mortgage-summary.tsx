import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useMortgage } from "@/context/mortgate-context"
import { getOrdinalSuffix } from "@/lib/get-ordinal-suffix"
import type { CalculateAmortizationScheduleReturnType } from "@/types"

type MortgageSummaryProps = Omit<
	CalculateAmortizationScheduleReturnType,
	"schedule"
> & {
	numberOfPaymentsMade: number
}

export function MortgageSummary({
	totalInterest,
	totalPaid,
	numberOfPaymentsMade,
}: MortgageSummaryProps) {
	const { mortgageDetails } = useMortgage()

	const endingYear = Math.ceil(numberOfPaymentsMade / 12)

	return (
		<Card>
			<CardHeader>
				<CardTitle>Mortgage Summary</CardTitle>
			</CardHeader>
			<CardContent>
				<dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-gray-700">
					<dt className="col-span-2 text-sm font-medium text-gray-500">
						Total Paid
					</dt>
					<dd className="col-span-2 text-lg font-bold text-green-700 mb-2">
						{totalPaid.toLocaleString()}
					</dd>
					<dt className="col-span-2 text-sm font-medium text-gray-500">
						Total Interest Paid
					</dt>
					<dd className="col-span-2 text-lg font-bold text-red-700">
						{totalInterest.toLocaleString()}
					</dd>
				</dl>
				<p>
					{!!mortgageDetails.extraPayment &&
						`With the extra payments you've made, you can expect to fully amortize your mortgage by the ${getOrdinalSuffix(endingYear)} year`}
				</p>
			</CardContent>
		</Card>
	)
}
