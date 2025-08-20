import type { ReactNode } from "react"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"

export function ExtraPaymentInfoHoverCard({ children }: { children: ReactNode }) {
	return (
		<HoverCard>
			<HoverCardTrigger asChild>{children}</HoverCardTrigger>
			<HoverCardContent className="w-80 bg-primary">
				<p className="text-xs text-primary-foreground">
					Extra payments can significantly reduce the total interest paid over the life of the loan. You can specify the
					amount, frequency, and how much of the extra payment goes towards the principal versus investments.
				</p>
			</HoverCardContent>
		</HoverCard>
	)
}

export function ExtraPaymentFormInfoHoverCard({ children }: { children: ReactNode }) {
	return (
		<HoverCard>
			<HoverCardTrigger asChild>{children}</HoverCardTrigger>
			<HoverCardContent className="w-80 bg-primary">
				<p className="text-xs text-primary-foreground">
					Extra payments can significantly reduce the total interest paid over the life of the loan. You can specify the
					amount, frequency, and how much of the extra payment goes towards the principal versus investments.
				</p>
			</HoverCardContent>
		</HoverCard>
	)
}

export function StartMonthFormInfoHoverCard({ children, endMonth }: { children: ReactNode; endMonth: number }) {
	return (
		<HoverCard>
			<HoverCardTrigger asChild>{children}</HoverCardTrigger>
			<HoverCardContent className="w-80 bg-primary">
				<p className="text-xs text-primary-foreground">
					The start month is the month when the extra payments begin. The end month is the month when the extra payments
					stop. It must be between 0 (inclusive) and {endMonth} (inclusive).
				</p>
			</HoverCardContent>
		</HoverCard>
	)
}

export function EndMonthFormInfoHoverCard({
	children,
	startMonth,
	endMonth,
}: {
	children: ReactNode
	startMonth: number
	endMonth: number
}) {
	return (
		<HoverCard>
			<HoverCardTrigger asChild>{children}</HoverCardTrigger>
			<HoverCardContent className="w-80 bg-primary">
				<p className="text-xs text-primary-foreground">
					The end month is the month when the extra payments stop. It must be between {startMonth} (inclusive) and{" "}
					{endMonth} (inclusive).
				</p>
			</HoverCardContent>
		</HoverCard>
	)
}
