import { tool } from "@langchain/core/tools";
import z from "zod";
import sgMail from "../config/sendgrid.js";
import { config } from "../config/env.js";

export const emailTool = tool(
  async ({ to, subject, body }) => {
    console.log(`📧 Sending email to ${to} with subject: "${subject}"...`);
    try {
      const msg = {
        to,
        from: config.sendgridFromEmail,
        subject,
        text: body,
        html: `<p>${body.replace(/\n/g, "<br>")}</p>`,
      };
      await sgMail.send(msg);
      return `Email successfully sent to ${to} with subject "${subject}"`;
    } catch (error) {
      console.error("SendGrid error:", error.response ? error.response.body : error.message);
      return `Failed to send email: ${error.message}`;
    }
  },
  {
    name: "send_email_tool",
    description: "Sends an email to a recipient. Use this tool whenever the user asks to send an email.",
    schema: z.object({
      to: z.string().describe("The recipient email address"),
      subject: z.string().describe("The subject line of the email"),
      body: z.string().describe("The content or body of the email"),
    }),
  }
);
