import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";
import dotenv from "dotenv";

dotenv.config();

export async function POST(req: Request) {
  try {
    const { name, email, subject } = await req.json();

    if (!name || !email || !subject) {
      return NextResponse.json({ message: "All fields are required" }, { status: 400 });
    }


    const transporter = nodemailer.createTransport({
      host: process.env.BREVO_SMTP_SERVER, 
      port: process.env.BREVO_SMTP_PORT, 
      secure: false, 
      auth: {
        user: process.env.BREVO_SMTP_USER, 
        pass: process.env.BREVO_SMTP_PASSWORD, 
      },} as SMTPTransport.Options);

    const mailOptions = {
      from: "akashbca9508@gmail.com", 
      to: "akashbca9508@gmail.com",
      subject: `New Contact Form Submission: ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; background-color: #f9f9f9;">
          <h2 style="color: #333; text-align: center;">📩 New Contact Form Submission</h2>
          
          <div style="background-color: #fff; padding: 15px; border-radius: 5px; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);">
            <p><strong style="color: #555;">Name:</strong> ${name}</p>
            <p><strong style="color: #555;">Email:</strong> <a href="mailto:${email}" style="color: #007bff;">${email}</a></p>
            <p><strong style="color: #555;">Message:</strong></p>
            <p style="background-color: #f1f1f1; padding: 10px; border-radius: 5px; color: #333;">${subject}</p>
          </div>
    
          <footer style="text-align: center; margin-top: 20px; font-size: 12px; color: #777;">
            <p>🔹 Sent from your Portfolio Website</p>
          </footer>
        </div>
      `,
    };
    

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ message: "Message sent successfully!" }, { status: 200 });
  } catch (error) {
    console.error("Nodemailer Error:", error);
    return NextResponse.json({ message: "Failed to send email" }, { status: 500 });
  }
}
