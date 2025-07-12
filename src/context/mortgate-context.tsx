"use client"

import type React from "react"
import { createContext, useContext, useState } from "react"

type MortgageDetails = {
	loanAmount: number
	loanTerm: number
	interestRate: number
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
		loanAmount: 0,
		loanTerm: 0,
		interestRate: 0,
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
