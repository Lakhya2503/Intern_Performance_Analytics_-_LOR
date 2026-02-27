import { BrevoClient } from '@getbrevo/brevo';
import ApiError from '../utils/ApiError.js';

// Initialize Brevo client with API key from environment variables
const apiInstance = new BrevoClient({
  apiKey: process.env.SMTP_API_KEY, // Must be a valid API key
});

/**
 * Send Letter of Recommendation via email with attachment
 *
 * @param {string} email - Recipient's email address
 * @param {string} name - Recipient's name
 * @param {Buffer} pdfBuffer - PDF file buffer
 * @param {string} fileName - Name of the attached file
 * @returns {Promise<Object>} Success status object
 * @throws {ApiError} When email sending fails
 */
export const sendLorViaEmail = async (email, name, pdfBuffer, fileName) => {
  // Input validation
  if (!email || !name || !pdfBuffer || !fileName) {
    throw new ApiError(400, 'Missing required parameters for email sending');
  }

  try {
    // Configure email content and metadata
    const sendSmtpEmail = {
      // Sender information
      sender: {
        email: 'laxman2509shinde@gmail.com',
        name: 'Athenura'
      },

      // Recipient information
      to: [{
        email: email,
        name: name
      }],

      // Email subject line
      subject: 'Your Letter of Recommendation',

      // HTML email body with styling
      htmlContent: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }

            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              line-height: 1.6;
              color: #333333;
              background-color: #f4f4f4;
              margin: 0;
              padding: 20px;
            }

            .email-container {
              max-width: 600px;
              margin: 0 auto;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              border-radius: 12px;
              padding: 3px;
              box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
            }

            .email-content {
              background-color: #ffffff;
              border-radius: 10px;
              padding: 40px;
            }

            .header {
              text-align: center;
              margin-bottom: 30px;
              border-bottom: 2px solid #f0f0f0;
              padding-bottom: 20px;
            }

            .logo {
              font-size: 28px;
              font-weight: bold;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
              background-clip: text;
              margin-bottom: 10px;
            }

            h3 {
              color: #333333;
              font-size: 24px;
              margin-bottom: 15px;
              font-weight: 600;
            }

            .greeting {
              font-size: 18px;
              color: #555555;
              margin-bottom: 20px;
            }

            .message {
              background: linear-gradient(to right, #f8f9fa, #ffffff);
              padding: 25px;
              border-radius: 8px;
              margin: 20px 0;
              border-left: 4px solid #667eea;
            }

            .message p {
              margin-bottom: 15px;
              font-size: 16px;
              color: #444444;
            }

            .attachment-info {
              background-color: #f0f7ff;
              border: 1px solid #b8daff;
              border-radius: 6px;
              padding: 12px 15px;
              margin: 20px 0;
              color: #004085;
              font-size: 14px;
              display: inline-block;
            }

            .attachment-info i {
              margin-right: 8px;
            }

            .signature {
              margin-top: 30px;
              padding-top: 20px;
              border-top: 2px solid #f0f0f0;
            }

            .signature p {
              margin-bottom: 5px;
            }

            .team-name {
              font-weight: bold;
              color: #667eea;
              font-size: 18px;
            }

            .footer {
              margin-top: 30px;
              text-align: center;
              font-size: 12px;
              color: #888888;
            }

            .footer p {
              margin-bottom: 5px;
            }

            .divider {
              height: 1px;
              background: linear-gradient(to right, transparent, #dddddd, transparent);
              margin: 20px 0;
            }

            @media only screen and (max-width: 600px) {
              .email-content {
                padding: 20px;
              }

              h3 {
                font-size: 20px;
              }
            }
          </style>
        </head>
        <body>
          <div class="email-container">
            <div class="email-content">
              <div class="header">
                <div class="logo">✨ Athenura</div>
              </div>

              <div class="greeting">
                <h3>Hello ${name},</h3>
              </div>

              <div class="message">
                <p>🌟 We hope this message finds you well!</p>
                <p>Your <strong>Letter of Recommendation</strong> has been successfully processed and is now ready for your review.</p>
                <p>📎 You'll find the document attached to this email. Please ensure you save it for your records.</p>
              </div>

              <div class="attachment-info">
                <i>📁</i> Attachment: <strong>${fileName}</strong> (PDF format)
              </div>

              <div class="divider"></div>

              <div class="signature">
                <p>Best regards,</p>
                <p class="team-name">The Athenura Team</p>
                <p style="color: #666666; font-size: 14px;">Empowering your academic journey</p>
              </div>

              <div class="footer">
                <p>© ${new Date().getFullYear()} Athenura. All rights reserved.</p>
                <p>This is an automated message, please do not reply directly to this email.</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,

      // Email attachment
      attachment: [{
        content: pdfBuffer.toString('base64'),
        name: fileName
      }],

      // Optional: Add tags for tracking
      tags: ['LOR', 'Recommendation-Letter'],

      // Optional: Set email priority
      headers: {
        'X-Priority': '1 (Highest)',
        'X-MSMail-Priority': 'High',
        'Importance': 'High'
      }
    };

    // Send the email using Brevo API
    const response = await apiInstance.transactionalEmails.sendTransacEmail(sendSmtpEmail);

    console.log(`✅ Email sent successfully to ${email} with messageId: ${response.messageId}`);

    return {
      success: true,
      messageId: response.messageId,
      recipient: email
    };

  } catch (error) {
    // Log the error for debugging
    console.error('❌ Error sending email:', {
      error: error.message,
      recipient: email,
      fileName: fileName,
      timestamp: new Date().toISOString()
    });

    // Throw a formatted API error
    throw new ApiError(
      500,
      error.message || 'Failed to send email',
      {
        recipient: email,
        fileName: fileName
      }
    );
  }
};

// Optional: Export additional utility functions
export const validateEmailConfig = () => {
  if (!process.env.SMTP_API_KEY) {
    throw new ApiError(500, 'SMTP API key is not configured');
  }
  return true;
};
