export function toDecimal(value: string | number): number {
	if (typeof value === "number") {
		return Number(Number(value).toFixed(2))
	}

	const parsedString = parseInt(value)
	if (Number.isNaN(parsedString)) {
		return parsedString
	}

	return Number(parsedString.toFixed(2))
}
