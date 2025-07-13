import {
	Table,
	TableBody,
	TableCell,
	TableHeader,
	TableRow,
} from "@components/ui/table"
import { format } from "date-fns"
import { getMonthName } from "@/lib/get-month-name"
import type { Payment } from "@/types"

function FullSpanRow({ children }: { children: React.ReactNode }) {
	return (
		<TableRow className="bg-gray-100">
			<TableCell colSpan={5} className="text-center font-bold">
				{children}
			</TableCell>
		</TableRow>
	)
}

export function MortgageTable({ schedule }: { schedule: Payment[] }) {
	return (
		<Table>
			<TableHeader>
				<TableRow>
					<TableCell className="font-bold">Payment Number</TableCell>
					<TableCell className="font-bold">Payment Amount</TableCell>
					<TableCell className="font-bold">Principal Paid</TableCell>
					<TableCell className="font-bold">Interest Paid</TableCell>
					<TableCell className="font-bold">Remaining Balance</TableCell>
				</TableRow>
			</TableHeader>
			<TableBody>
				{schedule.map((payment) => {
					const rows = []
					if ((payment.paymentNumber - 1) % 12 === 0) {
						const year = Math.floor((payment.paymentNumber - 1) / 12) + 1
						rows.push(
							<FullSpanRow key={`year-${year}`}>Year {year}</FullSpanRow>,
						)
					}

					console.log("Payment Number:", payment.paymentNumber % 12)

					rows.push(
						<TableRow key={payment.paymentNumber}>
							<TableCell>
								{payment.paymentNumber} - {getMonthName(payment.paymentNumber)}
							</TableCell>
							<TableCell>{payment.paymentAmount.toLocaleString()}</TableCell>
							<TableCell>{payment.principalPaid.toLocaleString()}</TableCell>
							<TableCell>{payment.interestPaid.toLocaleString()}</TableCell>
							<TableCell>{payment.remainingBalance.toLocaleString()}</TableCell>
						</TableRow>,
					)

					return rows
				})}
				<FullSpanRow>End</FullSpanRow>
			</TableBody>
		</Table>
	)
}
