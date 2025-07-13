"use client"

import type React from "react"
import { createContext, useContext, useState } from "react"
import type { ExtraPaymentIncrementFrequency } from "@/types"

type MortgageDetails = {
	principalLoanAmount: number
	loanTermYears: number
	annualInterestRate: number
	extraPayment?: number
	extraPaymentIncrement?: number
	extraPaymentIncrementFrequency?: (typeof ExtraPaymentIncrementFrequency)[number]
}

type MortgageContextType = {
	mortgageDetails: MortgageDetails
	setMortgageDetails: (details: MortgageDetails) => void
}

const MortgageContext = createContext<MortgageContextType | undefined>(
	undefined,
)

export const MortgageProvider = ({
	children,
}: {
	children: React.ReactNode
}) => {
	const [mortgageDetails, setMortgageDetails] = useState<MortgageDetails>({
		principalLoanAmount: 0,
		loanTermYears: 0,
		annualInterestRate: 0,
		extraPayment: 0,
		extraPaymentIncrement: 0,
		extraPaymentIncrementFrequency: "monthly",
	})

	return (
		<MortgageContext.Provider value={{ mortgageDetails, setMortgageDetails }}>
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
