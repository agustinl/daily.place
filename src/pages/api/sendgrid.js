import sendgrid from "@sendgrid/mail";

sendgrid.setApiKey(process.env.SENDGRID_API_KEY);

async function sendEmail(req, res) {
	try {
		await sendgrid.send({
			to: process.env.SENDGRID_API_EMAIL,
			from: process.env.SENDGRID_API_EMAIL,
			subject: "[daily.place] Feedback",
            content: [
                {
                  type: 'text/html',
                  value: `<div>
                  <p>Name: ${req.body.name}</p>
                  <p>Email: ${req.body.email}</p>
                  <p>Message: ${req.body.message}</p>
                  </div>`
                }
            ]
		});
	} catch (error) {
		console.log(error.response.body);
		return res
			.status(error.statusCode || 500)
			.json({ error: error.message });
	}

	return res.status(200).json({ error: "" });
}

export default sendEmail;
