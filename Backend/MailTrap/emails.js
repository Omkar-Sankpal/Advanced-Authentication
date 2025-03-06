import { PASSWORD_RESET_REQUEST_TEMPLATE, PASSWORD_RESET_SUCCESS_TEMPLATE, VERIFICATION_EMAIL_TEMPLATE } from "./emailTemplates.js";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();


const transporter = nodemailer.createTransport({
  service: "gmail", 
  auth: {
    user: process.env.SMTP_USER, 
    pass: process.env.SMTP_PASS, 
  },
});

const sender = process.env.SMTP_USER; 

export const sendVerificationEmail = async (email, verificationToken) => {
  try {
    const response = await transporter.sendMail({
      from: sender,
      to: email,
      subject: "Verify your email",
      html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationToken),
    });

    console.log("Verification email sent: ", response);
  } catch (error) {
    console.error("Error sending verification email: ", error);
    throw new Error(`Error sending verification email: ${error.message}`);
  }
};

export const sendWelcomeEmail = async (email, name) => {
  try {
    const response = await transporter.sendMail({
      from: sender,
      to: email,
      subject: "Welcome to Our Platform!",
      html: `<p>Hi ${name}, welcome to TEST AUTHENTICATION!</p>`,
    });

    console.log("Welcome email sent: ", response);
  } catch (error) {
    console.error("Error sending welcome email: ", error);
    throw new Error(`Error sending welcome email: ${error.message}`);
  }
};

export const sendPasswordResetEmail = async (email, resetURL) => {
  try {
    const response = await transporter.sendMail({
      from: sender,
      to: email,
      subject: "Reset your password",
      html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL),
    });

    console.log("Password reset email sent: ", response);
  } catch (error) {
    console.error("Error sending password reset email: ", error);
    throw new Error("Error sending password reset email");
  }
};

export const sendResetSuccessEmail = async (email) => {
  try {
    const response = await transporter.sendMail({
      from: sender,
      to: email,
      subject: "Your Password was reset successfully",
      html: PASSWORD_RESET_SUCCESS_TEMPLATE,
    });

    console.log("Password reset success email sent: ", response);
  } catch (error) {
    console.error("Error sending password reset success email: ", error);
    throw new Error("Error sending password reset success email");
  }
};

transporter.verify((error, success) => {
  if (error) {
    console.error("SMTP connection error: ", error);
  } else {
    console.log("SMTP connection successful!");
  }
});
