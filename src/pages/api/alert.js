const API_URL = "https://graphql.datocms.com";
const API_TOKEN = process.env.DATOCMS_API_TOKEN;

async function fetchAPI(query) {
	try {
		const res = await fetch(API_URL, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Accept: "application/json",
				Authorization: API_TOKEN,
			},
			body: JSON.stringify({
				query,
			}),
		});

		const json = await res.json();
		return json;
	} catch (error) {
		console.log(error);
	}
}

export async function getAlerts() {
	const data = await fetchAPI(`
    {
        allAlerts {
            title
            description {
                value
            }
        }
    }
    `);
	return data;
}
