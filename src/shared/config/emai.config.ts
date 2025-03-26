import { createTransport } from "nodemailer";
import { LSA } from "./env.config";

export const transporter = createTransport({
  service: "Gmail",
  secure: true,
  port: 465,
  auth: {
    user: LSA.USER,
    pass: LSA.PASS,
  },
});

export const sendMail = async (
  email: string,
  subject: string,
  html: string
) => {
  try {
    const { accepted, rejected } = await transporter.sendMail({
      from: LSA.USER,
      to: email,
      subject,
      html,
    });
    return { accepted, rejected };
  } catch (error) {
    return { accepted: null, rejected: null };
  }
};
