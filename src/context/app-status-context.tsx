"use client"

import { createContext, type ReactNode, useContext, useState } from "react"

type AppStatusContextType = {
	setSubmitted: (submitted: boolean) => void
	submitted: boolean
}

const AppStatusContext = createContext<AppStatusContextType | undefined>(undefined)

export const AppStatusProvider = ({ children }: { children: ReactNode }) => {
	const [submitted, setSubmitted] = useState(false)

	return <AppStatusContext.Provider value={{ submitted, setSubmitted }}>{children}</AppStatusContext.Provider>
}

export const useAppStatus = () => {
	const context = useContext(AppStatusContext)
	if (!context) {
		throw new Error("useAppStatus must be used within an AppStatusProvider")
	}
	return context
}
