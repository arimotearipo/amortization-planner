import Image from "next/image"
import { ModeToggle } from "@/components/mode-toggle"

export function Header() {
	return (
		<header className="sticky top-0 z-50 w-full border-b">
			<div className="grid grid-cols-3 p-1">
				<div className="col-span-1 col-start-2 flex justify-center items-center gap-2">
					<Image src="/favicon.svg" alt="Logo" width={32} height={32} />
					<h1 className="text-xl font-semibold tracking-tight text-secondary-foreground">
						Amortization Planner
					</h1>
				</div>
				<div className="col-span-1 col-start-3 justify-self-end mr-4">
					<ModeToggle />
				</div>
			</div>
		</header>
	)
}
