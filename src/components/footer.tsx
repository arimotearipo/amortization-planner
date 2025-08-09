import { SocialMediaShare } from "@/components/social-media-share"

export function Footer() {
	return (
		<footer className="flex flex-col md:flex-row md:items-center md:justify-center gap-x-4 gap-y-1 w-full text-center py-1 px-4 text-sm text-muted-foreground border-t">
			<span className="block md:inline">Created by Wan Nor Adzahari &middot; wnadzahari@gmail.com </span>
			<span>
				<a
					href="https://github.com/arimotearipo"
					target="_blank"
					rel="noopener noreferrer"
					className="underline hover:text-primary"
				>
					GitHub
				</a>{" "}
				|{" "}
				<a
					href="https://linkedin.com/in/wnadzahari"
					target="_blank"
					rel="noopener noreferrer"
					className="underline hover:text-primary"
				>
					LinkedIn
				</a>{" "}
				|{" "}
				<a
					href="https://coff.ee/wnadzahari"
					target="_blank"
					rel="noopener noreferrer"
					className="underline hover:text-primary"
				>
					Buy me a coffee
				</a>
			</span>
			<div className="flex items-center justify-center">
				<SocialMediaShare />
			</div>
		</footer>
	)
}
