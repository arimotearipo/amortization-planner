"use client"

import type React from "react"
import { createContext, useContext, useState } from "react"
import type { MortgageTermsInputs } from "@/components/models"
import type { AmortizationDetails } from "@/types"

type MortgageContextType = {
	mortgageTerms: MortgageTermsInputs
	setMortgageTerms: (details: MortgageTermsInputs) => void
	amortizationDetails: AmortizationDetails
	setAmortizationDetails: (details: AmortizationDetails) => void
	submitted: boolean
	setSubmitted: (submitted: boolean) => void
	openMortgageTermsForm: boolean
	setOpenMortgageTermsForm: (open: boolean) => void
}

const MortgageContext = createContext<MortgageContextType | undefined>(
	undefined,
)

export const MortgageProvider = ({
	children,
}: {
	children: React.ReactNode
}) => {
	const [submitted, setSubmitted] = useState(false)
	const [openMortgageTermsForm, setOpenMortgageTermsForm] = useState(true)

	const [mortgageTerms, setMortgageTerms] = useState<MortgageTermsInputs>({
		principalLoanAmount: 0,
		loanTermYears: 0,
		annualInterestRate: 0,
		extraPayment: 0,
		extraPaymentIncrement: 0,
		extraPaymentIncrementFrequency: "monthly",
		extraPaymentEndMonth: -1,
		extraPaymentStartMonth: 0,
		extraPaymentSplitRatio: 0.5,
		investmentReturnRate: 5,
	})

	const [amortizationDetails, setAmortizationDetails] =
		useState<AmortizationDetails>({
			schedule: [],
			totalPaid: 0,
			totalInterest: 0,
			totalInvestmentEarned: 0,
		})

	return (
		<MortgageContext.Provider
			value={{
				mortgageTerms,
				setMortgageTerms,
				amortizationDetails,
				setAmortizationDetails,
				submitted,
				setSubmitted,
				openMortgageTermsForm,
				setOpenMortgageTermsForm,
			}}
		>
			{children}
		</MortgageContext.Provider>
	)
}

// Custom hook for consuming the context
export const useMortgage = () => {
	const context = useContext(MortgageContext)
	if (!context) {
		throw new Error("useMortgage must be used within a MortgageProvider")
	}
	return context
}
