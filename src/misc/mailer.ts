import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "Gmail",
  host: process.env.MAIL_MESSAGE_HOST as string,
  port: parseInt(process.env.MAIL_MESSAGE_PORT!),
  secure: false,
  auth: {
    user: process.env.MAIL_MESSAGE_EMAIL,
    pass: process.env.MAIL_MESSAGE_PASS,
  },
});

const html = (message: string, code: string) => `
  <table style="background-color: #f2f2f2; padding: 20px; width: 100%; max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
    <tr>
      <td style="background-color: #ffffff; padding: 20px; border-radius: 8px;">
        <p style="color: #333333; font-size: 18px; margin-bottom: 20px;">Dear User,</p>
        <p style="color: #555555; font-size: 16px; margin-bottom: 20px;">${message}</p>
        <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; text-align: center; border: 1px solid #e0e0e0;">
          <h2 style="color: #00b894; font-size: 24px; margin-bottom: 10px; font-weight: normal;">
            <span style="display: block; margin-bottom: 15px;">Verification Code:</span>
            <table style="margin: 0 auto;">
              <tr>
                ${code
                  .split("")
                  .map(
                    (char) => `
                  <td style="background-color: #00b894; width: 50px; height: 50px; color: white; font-size: 25px; text-align: center; border-radius: 4px; margin: 0 5px;">${char}</td>
                `
                  )
                  .join("")}
              </tr>
            </table>
          </h2>
        </div>
        <p style="color: #555555; font-size: 16px; margin-top: 30px;">If you have any questions or need assistance, feel free to contact our support team.</p>
        <p style="color: #555555; font-size: 16px; margin-top: 20px;">Best regards,<br><strong>The Pharmazone Team</strong></p>
      </td>
    </tr>
  </table>
`;

export const sendVerificationEmail = async (email: string, code: string) => {
  await transporter.sendMail({
    from: "Pharmazone Manager",
    to: email,
    subject: "Email Verification",
    html: html(
      "Thank you for registering with Pharmazone. Please use the following verification code to complete your email verification:",
      code
    ),
  });
};
