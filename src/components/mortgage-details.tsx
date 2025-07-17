import { MortgageSummary } from "@/components/mortgage-summary"
import { MortgageTable } from "@/components/mortgage-table"
// import { SplitRatio } from "@/components/split-ratio"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function MortgageDetails() {
	return (
		<Tabs className="w-full" defaultValue="mortgage-details">
			<TabsList className="w-full justify-center gap-2">
				<TabsTrigger value="mortgage-details">Mortgage Details</TabsTrigger>
				<TabsTrigger value="payment-schedule">Payment Schedule</TabsTrigger>
			</TabsList>
			{/* <SplitRatio /> */}
			<TabsContent value="mortgage-details">
				<MortgageSummary />
			</TabsContent>
			<TabsContent value="payment-schedule">
				<MortgageTable />
			</TabsContent>
		</Tabs>
	)
}
