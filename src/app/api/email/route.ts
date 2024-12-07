import nodemailer, { TransportOptions } from "nodemailer";
import { NextRequest } from "next/server";

interface EmailRequestBody {
	name: string;
	email: string;
	subject: string;
	message: string;
}

export async function POST(req: NextRequest): Promise<Response> {
	try {
		const body: EmailRequestBody = await req.json();
		const { name, email, subject, message } = body;

		if (!name || !email || !subject || !message) {
			return new Response(JSON.stringify({ error: "All fields are required" }), { status: 400 });
		}

		const transporter = nodemailer.createTransport({
			host: process.env.SMTP_HOST,
			port: Number(process.env.SMTP_PORT),
			secure: false,
			auth: {
				user: process.env.SMTP_USER,
				pass: process.env.SMTP_PASS,
			},
		} as TransportOptions);

		await transporter.sendMail({
			from: `"${name} via Exam Fusion" <${process.env.SMTP_USER}>`,
			to: process.env.SMTP_RECEIVER_EMAIL || "chris@demetriad.co.uk",
			subject,
			text: message,
			replyTo: email,
		});

		return new Response(JSON.stringify({ success: "The message has been sent successfully" }), { status: 200 });
	} catch (error: unknown) {
		console.error("Couldn't send the email", error);

		return new Response(
			JSON.stringify({
				error: "Couldn't send the email",
				details: (error as Error).message,
			}),
			{ status: 500 }
		);
	}
}
