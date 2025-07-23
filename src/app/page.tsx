"use client"

import MortgageDetails from "@/components/mortgage-details"
import { MortgageTermsForm } from "@/components/mortgage-terms-form"

export default function Home() {
	return (
		<div className="flex flex-col flex-1 min-h-0">
			<div className="w-full">
				<MortgageDetails />
			</div>
			<div className="flex flex-col flex-1 min-h-0 justify-end">
				<MortgageTermsForm />
			</div>
		</div>
	)
}
