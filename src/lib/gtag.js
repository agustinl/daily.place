export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID;

// gtag is missing when there is no tracking ID or the script was blocked (e.g. by an ad blocker)
const gtag = (...args) => {
	if (GA_TRACKING_ID && typeof window !== "undefined" && typeof window.gtag === "function") {
		window.gtag(...args);
	}
};

// https://developers.google.com/analytics/devguides/collection/gtagjs/pages
export const pageview = url => {
	gtag("config", GA_TRACKING_ID, {
		page_path: url,
	});
};

// https://developers.google.com/analytics/devguides/collection/gtagjs/events
export const event = ({ action, category, label, value }) => {
	gtag("event", action, {
		event_category: category,
		event_label: label,
		value: value,
	});
};
