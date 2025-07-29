"use client"

import { Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { useMortgage } from "@/context/mortgate-context"
import { getOrdinalSuffix } from "@/lib/get-ordinal-suffix"

// Custom tooltip component
function CustomTooltip({ active, payload, label }: any) {
	if (!active || !payload || payload.length === 0) return null

	const year = getOrdinalSuffix(Math.floor(Number(label) / 12) + 1)
	const month = getOrdinalSuffix((Number(label) % 12) + 1)

	return (
		<div className="rounded bg-white dark:bg-gray-900 p-3 shadow-lg border border-gray-200 dark:border-gray-700 text-xs min-w-[160px]">
			<p className="font-semibold mb-1">Payment #{Number(label) + 1}</p>
			<p className="text-xs mb-1">
				{year} year {month} month
			</p>
			{payload.map((entry: any) => (
				<div key={entry.dataKey} className="flex justify-between mb-0.5">
					<span className="capitalize">{entry.name || entry.dataKey}:</span>
					<span className="font-mono ml-2" style={{ color: entry.color }}>
						{typeof entry.value === "number" ? entry.value.toLocaleString() : entry.value}
					</span>
				</div>
			))}
		</div>
	)
}

export function MortgageSummaryChart() {
	const { amortizationDetails } = useMortgage()

	const data = amortizationDetails.schedule.map((item) => ({
		paymentNumber: item.paymentNumber,
		totalPrincipalPaid: item.totalPrincipalPaid,
		interestPaid: item.interestPaid,
		remainingBalance: item.remainingBalance,
		investmentGrowth: item.investmentGrowth,
	}))

	return (
		<div className="w-full flex flex-col gap-8 mt-6">
			<div className="w-full overflow-x-auto">
				<div className="w-full text-center">
					<h3 className="text-primary font-semibold underline">
						Investment Growth vs Mortgage&apos;s Remaining Balance
					</h3>
					<p className="text-xs mx-auto max-w-[95%] md:max-w-[50%]">
						This chart compares your mortgage&apos;s remaining balance with the growth of your investments over time.
						The point where the investment growth line crosses the remaining balance line highlights when your
						investments could fully pay off your mortgage.
					</p>
				</div>
				<div className="min-w-[350px] sm:min-w-0" style={{ height: 400 }}>
					<ResponsiveContainer width="100%" height="100%">
						<LineChart
							data={data}
							margin={{
								top: 5,
								right: 30,
								left: 20,
								bottom: 5,
							}}
						>
							<XAxis dataKey="paymentNumber" />
							<YAxis />
							<Tooltip content={<CustomTooltip />} />
							<Legend />
							<Line type="monotone" dataKey="remainingBalance" stroke="#78C841" name="Remaining Balance" dot={false} />
							<Line type="monotone" dataKey="investmentGrowth" stroke="#FB4141" name="Investment Growth" dot={false} />
						</LineChart>
					</ResponsiveContainer>
				</div>
			</div>
			<div className="w-full overflow-x-auto">
				<div className="w-full text-center">
					<h3 className="text-primary font-semibold underline">
						Monthly Payment to Principal vs Monthly Payment to Interest
					</h3>
					<p className="text-xs mx-auto max-w-[95%] md:max-w-[50%]">
						This chart shows how each monthly payment is split between principal and interest. Early in your mortgage, a
						larger portion of your payment goes toward interest, while over time, more of your payment is applied to the
						principal. If you do not make extra payments, you&apos;ll notice this shift as your mortgage progresses.
					</p>
				</div>
				<div className="min-w-[350px] sm:min-w-0" style={{ height: 400 }}>
					<ResponsiveContainer width="100%" height="100%">
						<LineChart
							data={data}
							margin={{
								top: 5,
								right: 30,
								left: 20,
								bottom: 5,
							}}
						>
							<XAxis dataKey="paymentNumber" />
							<YAxis />
							<Tooltip content={<CustomTooltip />} />
							<Legend />
							<Line
								type="monotone"
								dataKey="totalPrincipalPaid"
								stroke="#78C841"
								name="Total Payment towards Principal"
								dot={false}
							/>
							<Line
								type="monotone"
								dataKey="interestPaid"
								stroke="#FB4141"
								name="Total Payment towards Interest"
								dot={false}
							/>
						</LineChart>
					</ResponsiveContainer>
				</div>
			</div>
		</div>
	)
}
