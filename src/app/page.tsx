import { MortgageSummary } from "@/components/mortgage-summary"
import { MortgageTable } from "@/components/mortgage-table"
import { MortgageTermsForm } from "@/components/mortgage-terms-form"

export default function Home() {
	return (
		<div className="flex flex-col lg:flex-row min-h-full space-y-4 lg:space-y-0 lg:space-x-1 p-1 sm:p-1 lg:p-1">
			<div className="w-full lg:w-auto lg:flex-shrink-0">
				<MortgageTermsForm />
			</div>
			<div className="w-full lg:w-auto lg:flex-shrink-0">
				<MortgageSummary />
			</div>
			<div className="w-full lg:flex-1 lg:overflow-hidden">
				<MortgageTable />
			</div>
		</div>
	)
}
