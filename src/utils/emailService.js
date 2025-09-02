const { SESv2Client, SendEmailCommand } = require("@aws-sdk/client-sesv2");
const dotenv = require("dotenv");
dotenv.config();

const sesClient = new SESv2Client({
  region: process.env.SES_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

async function sendEmail(to, subject, htmlContent) {
  try {
    const command = new SendEmailCommand({
      FromEmailAddress: process.env.SES_FROM,
      Destination: { ToAddresses: [to] },
      Content: {
        Simple: {
          Subject: { Data: subject },
          Body: {
            Html: { Data: htmlContent },
            Text: { Data: htmlContent.replace(/<[^>]+>/g, "") }, // fallback plain text
          },
        },
      },
    });

    const result = await sesClient.send(command);
    console.log("✅ Email sent:", result.MessageId);
    return result;
  } catch (err) {
    console.error("❌ Error sending email:", err);
    throw err;
  }
}

module.exports = { sendEmail };
