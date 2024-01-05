import sendgrid from "@sendgrid/mail";

sendgrid.setApiKey(process.env.SENDGRID_API_KEY);

async function sendEmail(req, res) {
	try {
        if (!req.body.message || req.body.message == "") {
            throw new Error("Message empty");
        }
		await sendgrid.send({
			to: process.env.SENDGRID_TO_EMAIL,
			from: process.env.SENDGRID_FROM_EMAIL,
			subject: "[daily.place] Contact",
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
		console.log(error.message);
		return res
			.status(error.statusCode || 500)
			.json({ error: error.message });
	}

	return res.status(200).json({ error: "" });
}

export default sendEmail;
