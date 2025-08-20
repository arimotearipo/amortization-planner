import type { ChangeEvent } from "react"

export function toNumber(event: ChangeEvent<HTMLInputElement>) {
	const { value } = event.target

	if (value === "") {
		return ""
	} else {
		return Number(value)
	}
}
