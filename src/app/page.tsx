import { MortgageSummary } from "@/components/mortgage-summary"
import { MortgageTable } from "@/components/mortgage-table"
import { MortgageTermsForm } from "@/components/mortgage-terms-form"

export default function Home() {
	return (
		<div className="flex flex-row space-x-1 p-1 h-screen overflow-hidden">
			<MortgageTermsForm />
			<MortgageSummary />
			<MortgageTable />
		</div>
	)
}
