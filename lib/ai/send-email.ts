import sgMail from "@sendgrid/mail";
import { tool } from "ai";
import { z } from "zod";

export const sendEmail = tool({
  description: 'Send an email to Sam Cedarbaum',
  parameters: z.object({
    from: z.string().optional(),
    subject: z.string().optional(),
    message: z.string(),
  }),
  execute: ({ message, from, subject }) => {
    return sendEmailViaSendGrid(message, from, subject);
  },
});

async function sendEmailViaSendGrid(message: string, from?: string, subject?: string) {
  if (
    !process.env.SENDGRID_API_KEY ||
    !process.env.NEXT_PUBLIC_CONTACT_EMAIL ||
    !process.env.SENDGRID_FROM_EMAIL
  ) {
    return {
      error: "Message sending not available right now.",
    };
  }

  const subjectOrDefault = subject || "Message from chat on cedarbaum.io";
  const fromOrDefault = from || "<unknown>";

  if (process.env.EMAIL_TEST_MODE) {
    console.log("Email test mode enabled, not sending email.");
    console.log("====================================");
    console.log(`From: ${fromOrDefault}\n\n${message}`);
    console.log("====================================");
    return {
      message,
      from: fromOrDefault,
      subject: subjectOrDefault,
      result: "Message successfully sent to Sam.",
    };
  }

  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  const msg = {
    to: process.env.NEXT_PUBLIC_CONTACT_EMAIL,
    from: process.env.SENDGRID_FROM_EMAIL,
    subject: subjectOrDefault,
    text: `From: ${fromOrDefault}\n\n${message}`,
  };
  try {
    await sgMail.send(msg);
  } catch (error: any) {
    console.error(error);
    if (error.response && error.response.body) {
      console.error(error.response.body);
    }

    return {
      error: "Message sending not available right now.",
    };
  }

  return {
    message,
    from: fromOrDefault,
    subject: subjectOrDefault,
    result: "Message successfully sent to Sam.",
  };
}