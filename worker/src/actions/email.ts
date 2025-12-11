import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || "",
    pass: process.env.EMAIL_PASS || "",
  },
});

export async function processEmail(email: string, body: string) {  

const info = await transporter.sendMail({
    from: process.env.EMAIL_USER || "", // sender address
    to: email,
    subject: "Hello ✔",
    text: body, // plain‑text body
    html: `<b>${body}</b>`, // HTML body
  });

  console.log("Message sent:", info.messageId, email);

}   