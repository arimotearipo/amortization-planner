"use client"
import {
	FacebookIcon,
	FacebookShareButton,
	LinkedinIcon,
	LinkedinShareButton,
	TwitterIcon,
	TwitterShareButton,
	WhatsappIcon,
	WhatsappShareButton,
} from "react-share"

const SHARE_URL = "https://amortization-planner.vercel.app"
const TITLE = "Plan how to pay off your mortgage faster with this Amortization Planner app!"

export function SocialMediaShare() {
	return (
		<div className="flex gap-x-2 w-fit">
			<FacebookShareButton url={SHARE_URL} title={TITLE}>
				<FacebookIcon size={24} round />
			</FacebookShareButton>
			<TwitterShareButton url={SHARE_URL} title={TITLE}>
				<TwitterIcon size={24} round />
			</TwitterShareButton>
			<LinkedinShareButton url={SHARE_URL} title={TITLE}>
				<LinkedinIcon size={24} round />
			</LinkedinShareButton>
			<WhatsappShareButton url={SHARE_URL} title={TITLE}>
				<WhatsappIcon size={24} round />
			</WhatsappShareButton>
		</div>
	)
}
