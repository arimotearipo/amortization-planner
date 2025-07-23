import { MortgageSummary } from "@/components/mortgage-summary"
import { MortgageSummaryChart } from "@/components/mortgage-summary-chart"
import { MortgageTable } from "@/components/mortgage-table"
import { SplitRatio } from "@/components/split-ratio"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useMortgage } from "@/context/mortgate-context"

export default function MortgageDetails() {
	const { submitted } = useMortgage()

	if (!submitted) {
		return (
			<p className="flex items-center justify-center h-full text-lg font-bold text-popover-foreground">
				Please submit mortgage terms to view details.
			</p>
		)
	}

	return (
		<Tabs className="w-full" defaultValue="mortgage-details">
			<TabsList className="w-full justify-center gap-2">
				<TabsTrigger value="mortgage-details">Mortgage Details</TabsTrigger>
				<TabsTrigger value="payment-schedule">Payment Schedule</TabsTrigger>
				<TabsTrigger value="payment-charts">Payment Charts</TabsTrigger>
			</TabsList>
			<SplitRatio />
			<TabsContent value="mortgage-details">
				<MortgageSummary />
			</TabsContent>
			<TabsContent value="payment-schedule">
				<MortgageTable />
			</TabsContent>
			<TabsContent value="payment-charts">
				<MortgageSummaryChart />
			</TabsContent>
		</Tabs>
	)
}
