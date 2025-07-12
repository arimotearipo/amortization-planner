import { MortgageDetailsForm } from "@components/mortgage-details-form"
import { MortgageTable } from "@/components/mortgate-table"
import { MortgageProvider } from "@/context/mortgate-context"

export default function Home() {
	return (
		<MortgageProvider>
			<MortgageDetailsForm />
			<MortgageTable />
		</MortgageProvider>
	)
}
