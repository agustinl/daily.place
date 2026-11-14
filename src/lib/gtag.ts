export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID;

interface GtagEvent {
	action: string;
	category?: string;
	label?: string;
	value?: number;
}

// gtag is missing when there is no tracking ID or the script was blocked (e.g. by an ad blocker)
const gtag = (...args: Parameters<Window['gtag']>) => {
	if (GA_TRACKING_ID && typeof window !== "undefined" && typeof window.gtag === "function") {
		window.gtag(...args);
	}
};

// https://developers.google.com/analytics/devguides/collection/gtagjs/pages
export const pageview = (url: string) => {
	gtag("config", GA_TRACKING_ID as string, {
		page_path: url,
	});
};

// https://developers.google.com/analytics/devguides/collection/gtagjs/events
export const event = ({ action, category, label, value }: GtagEvent) => {
	gtag("event", action, {
		event_category: category,
		event_label: label,
		value: value,
	});
};
