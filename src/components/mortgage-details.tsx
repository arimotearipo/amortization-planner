import { MortgageSummary } from "@/components/mortgage-summary"
import { MortgageSummaryChart } from "@/components/mortgage-summary-chart"
import { MortgageTable } from "@/components/mortgage-table"
import { SplitRatio } from "@/components/split-ratio"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAppStatus } from "@/context/app-status-context"

export default function MortgageDetails() {
	const { submitted } = useAppStatus()

	if (!submitted) {
		return (
			<p className="flex items-center justify-center h-full text-lg font-bold text-popover-foreground">
				Please submit mortgage terms to view details.
			</p>
		)
	}

	return (
		<Tabs className="w-full" defaultValue="mortgage-details">
			<TabsList className="w-full justify-center gap-1 sm:gap-2 h-9 sm:h-10">
				<TabsTrigger value="mortgage-details" className="text-xs sm:text-sm px-1.5 sm:px-4 min-w-0">
					<span className="hidden md:inline">Mortgage Details</span>
					<span className="hidden sm:inline md:hidden">Details</span>
					<span className="sm:hidden">Info</span>
				</TabsTrigger>
				<TabsTrigger value="payment-schedule" className="text-xs sm:text-sm px-1.5 sm:px-4 min-w-0">
					<span className="hidden md:inline">Payment Schedule</span>
					<span className="hidden sm:inline md:hidden">Schedule</span>
					<span className="sm:hidden">Table</span>
				</TabsTrigger>
				<TabsTrigger value="payment-charts" className="text-xs sm:text-sm px-1.5 sm:px-4 min-w-0">
					<span className="hidden md:inline">Payment Charts</span>
					<span className="hidden sm:inline md:hidden">Charts</span>
					<span className="sm:hidden">Graph</span>
				</TabsTrigger>
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
