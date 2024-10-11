import nodemailer from "nodemailer";
const SMTP_HOST = process.env.SMTP_HOST;
const SMTP_EMAIL = process.env.SMTP_EMAIL;
const SMTP_PASSWORD = process.env.SMTP_PASSWORD;

const transporter = nodemailer.createTransport({
    service: "gmail",
    host: SMTP_HOST,
    secure: true,
    auth: {
        user: SMTP_EMAIL,
        pass: SMTP_PASSWORD,
    },
});
export async function sendMail({
    sendTo,
    subject,
    text,
    html,
}: {
    sendTo: string;
    subject: string;
    text: string;
    html?: string;
}) {
    console.log(SMTP_EMAIL,SMTP_HOST,SMTP_PASSWORD)
    try {
    const isVerified = await transporter.verify();
  } catch (error) {
    console.error(
      "Something went wrong",
      SMTP_EMAIL,
      SMTP_PASSWORD,
      error,
    );
    return;
  }
  const info = await transporter.sendMail({
    from: SMTP_EMAIL,
    to: sendTo,
    subject: subject,
    text: text,
    html: html ? html : "",
  });
  console.log("Message Sent", info.messageId);
  console.log("Mail sent to", sendTo);
  return info;
}
