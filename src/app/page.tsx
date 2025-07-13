import { MortgageSummary } from "@/components/mortgage-summary"
import { MortgageTable } from "@/components/mortgage-table"
import { MortgageTermsForm } from "@/components/mortgage-terms-form"
import { MortgageProvider } from "@/context/mortgate-context"

export default function Home() {
	return (
		<MortgageProvider>
			<div className="flex flex-row space-x-2">
				<MortgageTermsForm />
				<MortgageSummary />
				<MortgageTable />
			</div>
		</MortgageProvider>
	)
}
