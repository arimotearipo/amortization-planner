import { format } from "date-fns"

export function getMonthName(monthNumber: number): string {
	// monthNumber: 1 = January, 12 = December
	return format(new Date(2000, monthNumber - 1, 1), "MMMM")
}
