import nodemailer from "nodemailer";
import config from "../config/config.js";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: config.mailUser,
    pass: config.mailPass,
  },
});

export default async function sendMail(to, subject, text) {
  await transporter.sendMail({
    from: config.mailUser,
    to,
    subject,
    text,
  });
}
