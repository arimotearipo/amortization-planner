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

// From here onwards, the components are going to be hover cards for

export function StartingBalanceTHCard({ children }: { children: ReactNode }) {
	return (
		<HoverCard>
			<HoverCardTrigger asChild>{children}</HoverCardTrigger>
			<HoverCardContent className="w-80 bg-primary">
				<p className="text-xs text-primary-foreground">
					This is the starting balance before you make the payment for this month. This value should be the same as the
					remaining balance of the previous month.
				</p>
			</HoverCardContent>
		</HoverCard>
	)
}

export function PaymentAmountTHCard({ children }: { children: ReactNode }) {
	return (
		<HoverCard>
			<HoverCardTrigger asChild>{children}</HoverCardTrigger>
			<HoverCardContent className="w-80 bg-primary">
				<p className="text-xs text-primary-foreground">
					This is the payment amount that you will pay this month. Usually this amount is fixed.
				</p>
			</HoverCardContent>
		</HoverCard>
	)
}

export function PaymentNumberTHCard({ children }: { children: ReactNode }) {
	return (
		<HoverCard>
			<HoverCardTrigger asChild>{children}</HoverCardTrigger>
			<HoverCardContent className="w-80 bg-primary">
				<p className="text-xs text-primary-foreground">
					This is the sequential number of the payment in your amortization schedule, starting from payment #1.
				</p>
			</HoverCardContent>
		</HoverCard>
	)
}

export function PrincipalPaidTHCard({ children }: { children: ReactNode }) {
	return (
		<HoverCard>
			<HoverCardTrigger asChild>{children}</HoverCardTrigger>
			<HoverCardContent className="w-80 bg-primary">
				<p className="text-xs text-primary-foreground">
					This is the portion of your regular monthly payment that goes toward reducing the principal balance of your
					loan. Early in the loan term, this amount is smaller, but it increases over time.
				</p>
			</HoverCardContent>
		</HoverCard>
	)
}

export function ExtraPaymentToPrincipalTHCard({ children }: { children: ReactNode }) {
	return (
		<HoverCard>
			<HoverCardTrigger asChild>{children}</HoverCardTrigger>
			<HoverCardContent className="w-80 bg-primary">
				<p className="text-xs text-primary-foreground">
					This is any additional payment you make toward the principal balance beyond your regular monthly payment.
					Extra principal payments can significantly reduce the total interest paid and shorten the loan term.
				</p>
			</HoverCardContent>
		</HoverCard>
	)
}

export function TotalPrincipalPaidTHCard({ children }: { children: ReactNode }) {
	return (
		<HoverCard>
			<HoverCardTrigger asChild>{children}</HoverCardTrigger>
			<HoverCardContent className="w-80 bg-primary">
				<p className="text-xs text-primary-foreground">
					This is the combined total of your regular principal payment and any extra principal payment for this month.
					It represents the total amount reducing your loan balance this payment period.
				</p>
			</HoverCardContent>
		</HoverCard>
	)
}

export function InterestPaidTHCard({ children }: { children: ReactNode }) {
	return (
		<HoverCard>
			<HoverCardTrigger asChild>{children}</HoverCardTrigger>
			<HoverCardContent className="w-80 bg-primary">
				<p className="text-xs text-primary-foreground">
					This is the portion of your monthly payment that goes toward interest charges. Early in the loan, most of your
					payment goes to interest, but this amount decreases over time as the principal balance is reduced.
				</p>
			</HoverCardContent>
		</HoverCard>
	)
}

export function RemainingBalanceTHCard({ children }: { children: ReactNode }) {
	return (
		<HoverCard>
			<HoverCardTrigger asChild>{children}</HoverCardTrigger>
			<HoverCardContent className="w-80 bg-primary">
				<p className="text-xs text-primary-foreground">
					This is the outstanding loan balance remaining after this payment is made. It becomes the starting balance for
					the next payment period.
				</p>
			</HoverCardContent>
		</HoverCard>
	)
}

export function InvestmentContributionTHCard({ children }: { children: ReactNode }) {
	return (
		<HoverCard>
			<HoverCardTrigger asChild>{children}</HoverCardTrigger>
			<HoverCardContent className="w-80 bg-primary">
				<p className="text-xs text-primary-foreground">
					This is the amount you choose to invest instead of making extra principal payments. This represents the
					opportunity cost comparison between paying down your mortgage faster versus investing that money.
				</p>
			</HoverCardContent>
		</HoverCard>
	)
}

export function InvestmentGrowthTHCard({ children }: { children: ReactNode }) {
	return (
		<HoverCard>
			<HoverCardTrigger asChild>{children}</HoverCardTrigger>
			<HoverCardContent className="w-80 bg-primary">
				<p className="text-xs text-primary-foreground">
					This is the cumulative value of your investments including both contributions and growth over time. When this
					value exceeds your remaining mortgage balance, you could theoretically pay off your mortgage using your
					investment returns.
				</p>
			</HoverCardContent>
		</HoverCard>
	)
}
