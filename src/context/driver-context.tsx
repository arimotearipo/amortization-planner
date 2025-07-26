"use client"

import { createContext, type PropsWithChildren, useContext, useState } from "react"

type DriverContext = {
	mortgateTermDone: boolean // including basic extra payment
	advanceExtraPaymentDone: boolean
	setMortgageTermDone: (value: boolean) => void
	setAdvanceExtraPaymentDone: (value: boolean) => void
}

const DriverContext = createContext<DriverContext | undefined>(undefined)

export function DriverProvider({ children }: PropsWithChildren) {
	const [mortgateTermDone, setMortgageTermDone] = useState(false)
	const [advanceExtraPaymentDone, setAdvanceExtraPaymentDone] = useState(false)

	return (
		<DriverContext.Provider
			value={{
				mortgateTermDone,
				advanceExtraPaymentDone,
				setMortgageTermDone,
				setAdvanceExtraPaymentDone,
			}}
		>
			{children}
		</DriverContext.Provider>
	)
}

export function useDriver() {
	const context = useContext(DriverContext)
	if (!context) {
		throw new Error("useDriverContext must be used within a DriverContextProvider")
	}
	return context
}
