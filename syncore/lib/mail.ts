import nodemailer from "nodemailer";

interface SendWelcomeEmailParams {
  email: string;
  name?: string | null;
}

// Create reusable transporter object using SMTP transport
export function getMailTransporter() {
  const host = process.env.SMTP_HOST || "smtp.gmail.com";
  const port = parseInt(process.env.SMTP_PORT || "587", 10);
  const secure = process.env.SMTP_SECURE === "true" || port === 465;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS || process.env.SMTP_PASSWORD;

  if (!user || !pass) {
    console.warn(
      "[SMTP Warning] SMTP_USER or SMTP_PASS environment variables are missing. Welcome emails will not be sent until configured in .env."
    );
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: {
      user,
      pass,
    },
  });
}

/**
 * Sends a modern, responsive welcome email to the user upon joining Syncore.
 */
export async function sendWelcomeEmail({ email, name }: SendWelcomeEmailParams) {
  try {
    if (!email) {
      console.warn("[Mail] No recipient email provided for welcome email.");
      return { success: false, error: "Missing email address" };
    }

    const transporter = getMailTransporter();
    if (!transporter) {
      return {
        success: false,
        error: "SMTP transporter not configured. Please add SMTP credentials to .env.",
      };
    }

    const displayName = name || email.split("@")[0] || "there";
    const appUrl =
      process.env.NEXTAUTH_URL ||
      process.env.NEXT_PUBLIC_APP_URL ||
      "http://localhost:3000";
    const dashboardUrl = `${appUrl}/dashboard`;
    const fromAddress =
      process.env.SMTP_FROM || `"Syncore" <${process.env.SMTP_USER}>`;

    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Welcome to Syncore</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0a0a0a; color: #ededed; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #0a0a0a; padding: 40px 16px;">
    <tr>
      <td align="center">
        <!-- Main Card -->
        <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 540px; background-color: #121212; border: 1px solid #262626; border-radius: 16px; overflow: hidden; box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6);">
          
          <!-- Header Bar -->
          <tr>
            <td style="padding: 28px 36px; border-bottom: 1px solid #202020;">
              <span style="font-size: 20px; font-weight: 600; letter-spacing: -0.5px; color: #ffffff;">Syncore</span>
            </td>
          </tr>

          <!-- Content Body -->
          <tr>
            <td style="padding: 36px 36px 28px 36px;">
              <h1 style="margin: 0 0 16px 0; font-size: 24px; font-weight: 400; letter-spacing: -0.4px; color: #ffffff;">
                Welcome, ${displayName}!
              </h1>
              
              <p style="margin: 0 0 18px 0; font-size: 15px; line-height: 1.6; color: #a3a3a3; font-weight: 300;">
                Welcome and enjoy this with your people. Create real-time collaborative watch rooms, queue your favorite YouTube videos, vote on what plays next, and stream together seamlessly.
              </p>

              <!-- Feature Highlights Box -->
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #171717; border: 1px solid #262626; border-radius: 12px; margin: 24px 0;">
                <tr>
                  <td style="padding: 16px 20px;">
                    <p style="margin: 0 0 8px 0; font-size: 13px; font-weight: 500; color: #ffffff;">What you can do right now:</p>
                    <ul style="margin: 0; padding-left: 18px; font-size: 13px; line-height: 1.7; color: #a3a3a3;">
                      <li>Create or join rooms with 4-digit PINs</li>
                      <li>See live multiplayer cursors of everyone in the room</li>
                      <li>Upvote & downvote upcoming video queues</li>
                      <li>Experience synced playback in real-time</li>
                    </ul>
                  </td>
                </tr>
              </table>

              <!-- CTA Button -->
              <table role="presentation" border="0" cellspacing="0" cellpadding="0" style="margin: 28px 0 10px 0;">
                <tr>
                  <td align="center" style="border-radius: 9999px; background-color: #ffffff;">
                    <a href="${dashboardUrl}" target="_blank" style="display: inline-block; padding: 12px 28px; font-size: 13px; font-weight: 600; color: #0a0a0a; text-decoration: none; border-radius: 9999px; letter-spacing: -0.2px;">
                      Launch Dashboard &rarr;
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 20px 36px 28px 36px; border-top: 1px solid #202020; text-align: left;">
              <p style="margin: 0; font-size: 11px; color: #525252; line-height: 1.5;">
                You received this email because you signed in to Syncore.<br />
                &copy; ${new Date().getFullYear()} Syncore. All rights reserved.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `.trim();

    const textContent = `
Welcome to Syncore, ${displayName}!

Welcome and enjoy this with your people. Create real-time collaborative watch rooms, queue your favorite YouTube videos, vote on what plays next, and stream together seamlessly.

Launch your dashboard: ${dashboardUrl}

© ${new Date().getFullYear()} Syncore. All rights reserved.
    `.trim();

    const info = await transporter.sendMail({
      from: fromAddress,
      to: email,
      subject: "Welcome to Syncore — stream & enjoy with your people",
      text: textContent,
      html: htmlContent,
    });

    console.log(`[Mail Success] Welcome email sent to ${email} (Message ID: ${info.messageId})`);
    return { success: true, messageId: info.messageId };
  } catch (error: unknown) {
    console.error(`[Mail Error] Failed to send welcome email to ${email}:`, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error sending email",
    };
  }
}
