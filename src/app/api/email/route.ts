import nodemailer, { type TransportOptions } from "nodemailer";
import type { NextRequest } from "next/server";
import { Question } from "@/app/components/Questions";

interface EmailRequestBody {
	name?: string;
	email?: string;
	subject: string;
	message: string;
	question?: Question;
}

export async function POST(req: NextRequest): Promise<Response> {
	try {
		const body: EmailRequestBody = await req.json();
		const { name, email, subject, message, question } = body;

		const mailOptions = {
			from: process.env.SMTP_RECEIVER_EMAIL || "chris@demetriad.co.uk",
			to: process.env.SMTP_RECEIVER_EMAIL || "chris@demetriad.co.uk",
			subject,
			text: `From ${name ? name : "ExamFusion"},\n\n${message}\n\n${question ? `Question:\n${JSON.stringify(question, null, 2)}` : ""}`,
			replyTo: email || process.env.SMTP_RECEIVER_EMAIL,
		};

		if (!subject || !message || (!question && (!name || !email))) {
			return new Response(
				JSON.stringify({
					error: question ? "Subject and message are required" : "Name, email, subject, and message are required",
				}),
				{ status: 400 }
			);
		}

		const transporter = nodemailer.createTransport({
			host: process.env.SMTP_HOST,
			port: Number(process.env.SMTP_PORT),
			secure: false,
			auth: {
				user: process.env.SMTP_USER,
				pass: process.env.SMTP_PASS,
			},
			logger: true,
		} as TransportOptions);

		try {
			await transporter.verify();
			console.log("SMTP connection is alright");
		} catch (error) {
			console.log("SMTP connection not really working", error);
			return new Response(
				JSON.stringify({
					error: "SMTP connection not really working",
					details: (error as Error).message,
				}),
				{ status: 500 }
			);
		}

		await transporter.sendMail(mailOptions);

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
