import { MortgageDetails } from "@/components/mortgage-details"
import { MortgageTermsForm } from "@/components/mortgage-terms-form"
import { MortgageProvider } from "@/context/mortgate-context"

export default function Home() {
	return (
		<MortgageProvider>
			<MortgageTermsForm />
			<MortgageDetails />
		</MortgageProvider>
	)
}
