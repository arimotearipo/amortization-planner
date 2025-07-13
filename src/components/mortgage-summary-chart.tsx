import {
	CartesianGrid,
	LabelList,
	ResponsiveContainer,
	Scatter,
	ScatterChart,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts"

type MortgageSummaryChartProps = {
	endingYear: number
	crossoverYear: number
}

export function MortgageSummaryChart({
	crossoverYear,
	endingYear,
}: MortgageSummaryChartProps) {
	const data = [
		{ y: crossoverYear, label: "Crossover Point", x: 0.5, fill: "#90EE90" }, // light blue
		{ y: endingYear, label: "End of Mortgage", x: 1.5, fill: "#87CEEB" }, // light green
	]

	return (
		<ResponsiveContainer width="100%" height={200}>
			<ScatterChart margin={{ top: 40, right: 5, bottom: 10, left: 5 }}>
				<CartesianGrid />
				<XAxis type="number" dataKey="x" hide />
				<YAxis type="number" dataKey="y" name="year" />
				<Tooltip
					// cursor={{ strokeDasharray: "3 3" }}
					content={({ active, payload }) => {
						if (active && payload && payload.length) {
							const data = payload[0].payload
							return (
								<div className="bg-white p-2 border rounded shadow">
									{`Year ${data.y} : ${data.label}`}
								</div>
							)
						}
						return null
					}}
				/>
				<Scatter name="A school" data={data}>
					<LabelList dataKey="label" position="top" fontSize={8} />
				</Scatter>
			</ScatterChart>
		</ResponsiveContainer>
	)
}
