import {
	feature,
	featureItem,
	priceItem,
	product,
} from "atmn";

// Features
export const ai = feature({
	id: "ai",
	name: "AI",
	type: "single_use",
});

// Products
export const pro = product({
	id: "pro",
	name: "Pro",
	items: [
		priceItem({
			price: 2,
			interval: "month",
		}),

		featureItem({
			feature_id: ai.id,
			included_usage: 20,
			interval: "month",
		}),
	],
});
