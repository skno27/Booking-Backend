/*
    This will be my first time creating this kind of functionality.
    That being said, I will rely heavily on gpt and other on the fly research here.
    My own touch, to protect my information, i will use environment variables for 
    sensitive data like my email and password.
*/

import nodemailer from "nodemailer";
import twilio from "twilio";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com", // im using gmail, you should look up your smtp server details
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});

export const sendEmail = async (to: string, subject: string, body: string) => {
  try {
    // email data
    const mailOptions = {
      from: process.env.EMAIL,
      to: to,
      subject: subject,
      text: body,
      html: `<h2>${body}</h2>`,
    };

    const mailToMe = {
      from: process.env.EMAIL,
      to: process.env.EMAIL,
      subject: "Customer Booking",
      text: `${to} has made a booking with us!`,
      html: `<h2>A new booking has been made by ${to}!</h2>`,
    };

    // send the email
    let info = await transporter.sendMail(mailOptions);
    await transporter.sendMail(mailToMe); // send email to myself too, for confirmation
    console.log("Email sent: %s", info.messageId);
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
};

export const sendText = async (to: string, message: string) => {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const twilioNumber = process.env.TWILIO_PHONE_NUMBER;
  const client = twilio(accountSid, authToken);

  try {
    const sms = await client.messages.create({
      body: message,
      from: twilioNumber,
      to: to,
    });
    console.log("SMS send successfully: %s", sms.sid);
    return true;
  } catch (error) {
    console.error("Error sending SMS:", error);
    return false;
  }
};
