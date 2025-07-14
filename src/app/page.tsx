"use client"

import MortgageDetails from "@/components/mortgage-details"
import { MortgageTermsForm } from "@/components/mortgage-terms-form"
import { Button } from "@/components/ui/button"
import { useMortgage } from "@/context/mortgate-context"

export default function Home() {
	const { setOpenMortgageTermsForm } = useMortgage()
	return (
		<div className="flex flex-col min-h-full">
			<div className="w-full">
				<MortgageDetails />
			</div>
			<MortgageTermsForm />
			<div className="flex justify-center mt-4">
				<Button
					className="btn btn-primary"
					onClick={() => setOpenMortgageTermsForm(true)}
				>
					Edit Mortgage Terms
				</Button>
			</div>
		</div>
	)
}
