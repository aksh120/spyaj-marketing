import nodemailer from "nodemailer";
import { supabaseAdmin as supabase, logEmail } from "./db";

export interface EmailOptions {
  to: string | string[];
  subject: string;
  text?: string;
  html?: string;
  replyTo?: string;
}

export interface ContactEmailData {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  subject?: string;
  message: string;
}

export interface QuoteEmailData {
  contactName: string;
  companyName?: string;
  email: string;
  phone?: string;
  productName: string;
  category?: string;
  quantity?: string;
  targetBudget?: string;
  requirements?: string;
  deliveryLocation?: string;
  source?: string;
}

const createTransporter = () => {
  const host = process.env.SMTP_HOST;
  const port = parseInt(process.env.SMTP_PORT || "465");
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    console.warn("SMTP not configured. Email sending disabled.");
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: true,
    auth: {
      user,
      pass,
    },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
  });
};

let transporter: nodemailer.Transporter | null = null;

const getTransporter = () => {
  if (!transporter) {
    transporter = createTransporter();
  }
  return transporter;
};

export async function sendEmail(options: EmailOptions): Promise<{
  success: boolean;
  messageId?: string;
  error?: string;
}> {
  const transport = getTransporter();

  if (!transport) {
    console.warn("--- MOCK EMAIL START ---");
    console.warn("To:", options.to);
    console.warn("Subject:", options.subject);
    console.warn(
      "SMTP not configured. This email was only logged to the console.",
    );
    console.warn("--- MOCK EMAIL END ---");
    return { success: true, messageId: "mock-id-" + Date.now() };
  }

  const from = process.env.SMTP_FROM || process.env.SMTP_USER;

  try {
    const info = await transport.sendMail({
      from: `SPYAJ Marketing <${from}>`,
      to: Array.isArray(options.to) ? options.to.join(", ") : options.to,
      subject: options.subject,
      text: options.text,
      html: options.html,
      replyTo: options.replyTo,
    });

    console.log("Email sent:", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Email send error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export function generateContactNotificationEmail(data: ContactEmailData): {
  subject: string;
  text: string;
  html: string;
} {
  const subject = `[SPYAJ Contact] ${data.subject || "New Contact Form Submission"}`;

  const text = `
New Contact Form Submission
============================

Name: ${data.name}
Email: ${data.email}
${data.phone ? `Phone: ${data.phone}` : ""}
${data.company ? `Company: ${data.company}` : ""}
Subject: ${data.subject || "General Inquiry"}

Message:
${data.message}

---
Reply to this email to respond directly to the customer.
  `.trim();

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${subject}</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 10px 10px 0 0;">
    <h1 style="margin: 0; font-size: 24px;">New Contact Form Submission</h1>
    <p style="margin: 5px 0 0 0;">SPYAJ Marketing</p>
  </div>

  <div style="background: #f8f9fa; padding: 20px; border: 1px solid #e9ecef;">
    <table style="width: 100%;">
      <tr><td style="padding: 10px 0;"><strong>Name:</strong></td><td>${data.name}</td></tr>
      <tr><td style="padding: 10px 0;"><strong>Email:</strong></td><td><a href="mailto:${data.email}">${data.email}</a></td></tr>
      ${data.phone ? `<tr><td style="padding: 10px 0;"><strong>Phone:</strong></td><td>${data.phone}</td></tr>` : ""}
      ${data.company ? `<tr><td style="padding: 10px 0;"><strong>Company:</strong></td><td>${data.company}</td></tr>` : ""}
      <tr><td style="padding: 10px 0;"><strong>Subject:</strong></td><td>${data.subject || "General Inquiry"}</td></tr>
    </table>
  </div>

  <div style="background: white; padding: 20px; border: 1px solid #e9ecef; border-top: none;">
    <h3 style="margin-top: 0;">Message:</h3>
    <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; white-space: pre-wrap;">${data.message}</div>
  </div>

  <div style="background: #f1f1f1; padding: 15px; text-align: center; font-size: 12px; color: #666; border-radius: 0 0 10px 10px;">
    <p style="margin: 0;">Reply to this email to respond directly to the customer.</p>
  </div>
</body>
</html>
  `.trim();

  return { subject, text, html };
}

export function generateQuoteNotificationEmail(data: QuoteEmailData): {
  subject: string;
  text: string;
  html: string;
} {
  const subject = `[SPYAJ Quote Request] ${data.productName}`;

  const text = `
New Quote Request
==================

Contact: ${data.contactName}
Email: ${data.email}
${data.phone ? `Phone: ${data.phone}` : ""}
${data.companyName ? `Company: ${data.companyName}` : ""}

Product: ${data.productName}
${data.category ? `Category: ${data.category}` : ""}
${data.quantity ? `Quantity: ${data.quantity}` : ""}
${data.targetBudget ? `Budget: ${data.targetBudget}` : ""}

${data.requirements ? `Requirements:\n${data.requirements}` : ""}

Source: ${data.source || "Website"}
  `.trim();

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${subject}</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #f59e0b 0%, #ef4444 100%); color: white; padding: 20px; border-radius: 10px 10px 0 0;">
    <h1 style="margin: 0; font-size: 24px;">🔔 New Quote Request</h1>
    <p style="margin: 5px 0 0 0;">SPYAJ Marketing</p>
  </div>

  <div style="background: #fff7ed; padding: 20px; border: 1px solid #fed7aa;">
    <h3 style="margin-top: 0;">📦 Product Requested</h3>
    <p style="font-size: 18px; font-weight: bold; margin: 0;">${data.productName}</p>
    ${data.category ? `<p style="margin: 5px 0 0 0; color: #666;">Category: ${data.category}</p>` : ""}
  </div>

  <div style="background: #f8f9fa; padding: 20px; border: 1px solid #e9ecef; border-top: none;">
    <h3 style="margin-top: 0;">👤 Contact Information</h3>
    <table style="width: 100%;">
      <tr><td style="padding: 8px 0;"><strong>Name:</strong></td><td>${data.contactName}</td></tr>
      <tr><td style="padding: 8px 0;"><strong>Email:</strong></td><td><a href="mailto:${data.email}">${data.email}</a></td></tr>
      ${data.phone ? `<tr><td style="padding: 8px 0;"><strong>Phone:</strong></td><td>${data.phone}</td></tr>` : ""}
      ${data.companyName ? `<tr><td style="padding: 8px 0;"><strong>Company:</strong></td><td>${data.companyName}</td></tr>` : ""}
    </table>
  </div>

  <div style="background: white; padding: 20px; border: 1px solid #e9ecef; border-top: none;">
    <h3 style="margin-top: 0;">📋 Request Details</h3>
    <table style="width: 100%;">
      ${data.quantity ? `<tr><td style="padding: 8px 0;"><strong>Quantity:</strong></td><td>${data.quantity}</td></tr>` : ""}
      ${data.targetBudget ? `<tr><td style="padding: 8px 0;"><strong>Budget:</strong></td><td>${data.targetBudget}</td></tr>` : ""}
      ${data.deliveryLocation ? `<tr><td style="padding: 8px 0;"><strong>Delivery:</strong></td><td>${data.deliveryLocation}</td></tr>` : ""}
    </table>
    ${
      data.requirements
        ? `
    <h4 style="margin-bottom: 10px;">Requirements:</h4>
    <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; white-space: pre-wrap;">${data.requirements}</div>
    `
        : ""
    }
  </div>

  <div style="background: #f1f1f1; padding: 15px; text-align: center; font-size: 12px; color: #666; border-radius: 0 0 10px 10px;">
    <p style="margin: 0;">Source: ${data.source || "Website"}</p>
  </div>
</body>
</html>
  `.trim();

  return { subject, text, html };
}

export async function sendContactNotification(
  data: ContactEmailData,
  submissionId: string,
): Promise<boolean> {
  const adminEmail = process.env.ADMIN_EMAIL;

  if (!adminEmail) {
    console.warn("ADMIN_EMAIL not configured");
    return false;
  }

  const { subject, text, html } = generateContactNotificationEmail(data);

  const result = await sendEmail({
    to: adminEmail,
    subject,
    text,
    html,
    replyTo: data.email,
  });

  await logEmail({
    recipient_email: adminEmail,
    subject,
    template: "contact_notification",
    status: result.success ? "sent" : "failed",
    related_entity_type: "contact",
    related_entity_id: submissionId,
    error_message: result.error || null,
    smtp_response: null,
  });

  if (result.success) {
    await supabase
      .from("contact_submissions")
      .update({
        email_sent: true,
        email_sent_at: new Date().toISOString(),
      })
      .eq("id", submissionId);
  }

  return result.success;
}

export async function sendQuoteNotification(
  data: QuoteEmailData,
  requestId: string,
): Promise<boolean> {
  const adminEmail = process.env.ADMIN_EMAIL;

  if (!adminEmail) {
    console.warn("ADMIN_EMAIL not configured");
    return false;
  }

  const { subject, text, html } = generateQuoteNotificationEmail(data);

  const result = await sendEmail({
    to: adminEmail,
    subject,
    text,
    html,
    replyTo: data.email,
  });

  await logEmail({
    recipient_email: adminEmail,
    subject,
    template: "quote_notification",
    status: result.success ? "sent" : "failed",
    related_entity_type: "quote",
    related_entity_id: requestId,
    error_message: result.error || null,
    smtp_response: null,
  });

  if (result.success) {
    await supabase
      .from("quote_requests")
      .update({
        email_sent: true,
        email_sent_at: new Date().toISOString(),
      })
      .eq("id", requestId);
  }

  return result.success;
}

export async function sendQuoteToUser(
  data: QuoteEmailData & { quotePrice: string },
  requestId: string,
): Promise<boolean> {
  const subject = `[SPYAJ Quote] Price for ${data.productName}`;

  const text = `
Hello ${data.contactName},

Thank you for your interest in ${data.productName}.

We are pleased to provide you with a quote:
Product: ${data.productName}
Quantity: ${data.quantity || "Requested amount"}
Quoted Price: ${data.quotePrice}

Best regards,
The SPYAJ Marketing Team
  `.trim();

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${subject}</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%); color: white; padding: 20px; border-radius: 10px 10px 0 0;">
    <h1 style="margin: 0; font-size: 24px;">Your Quote is Ready!</h1>
    <p style="margin: 5px 0 0 0;">SPYAJ Marketing</p>
  </div>

  <div style="background: white; padding: 20px; border: 1px solid #e9ecef; border-top: none;">
    <p>Hello ${data.contactName},</p>
    <p>Thank you for your interest in <strong>${data.productName}</strong>. We are pleased to provide you with the following quote:</p>

    <div style="background: #f0f9ff; padding: 20px; border-radius: 10px; margin: 20px 0; border: 1px solid #bae6fd;">
      <table style="width: 100%;">
        <tr><td style="padding: 5px 0;"><strong>Product:</strong></td><td>${data.productName}</td></tr>
        ${data.quantity ? `<tr><td style="padding: 5px 0;"><strong>Quantity:</strong></td><td>${data.quantity}</td></tr>` : ""}
        <tr><td style="padding: 5px 0;"><strong>Quoted Price:</strong></td><td style="font-size: 18px; color: #1e40af; font-weight: bold;">${data.quotePrice}</td></tr>
      </table>
    </div>

    <p>If you have any questions or would like to proceed with the order, please reply to this email.</p>

    <br/>
    <p>Best regards,<br/><strong>The SPYAJ Marketing Team</strong></p>
  </div>

  <div style="background: #f1f1f1; padding: 15px; text-align: center; font-size: 12px; color: #666; border-radius: 0 0 10px 10px;">
    <p style="margin: 0;">&copy; ${new Date().getFullYear()} SPYAJ Marketing. All rights reserved.</p>
  </div>
</body>
</html>
  `.trim();

  const result = await sendEmail({
    to: data.email,
    subject,
    text,
    html,
  });

  await logEmail({
    recipient_email: data.email,
    subject,
    template: "quote_to_user",
    status: result.success ? "sent" : "failed",
    related_entity_type: "quote",
    related_entity_id: requestId,
    error_message: result.error || null,
    smtp_response: null,
  });

  if (result.success) {
    await supabase
      .from("quote_requests")
      .update({
        quoted_price: data.quotePrice,
        status: "quoted",
        quoted_at: new Date().toISOString(),
      })
      .eq("id", requestId);
  }

  return result.success;
}

export default {
  sendEmail,
  sendContactNotification,
  sendQuoteNotification,
  sendQuoteToUser,
};
