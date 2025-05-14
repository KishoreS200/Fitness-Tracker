import nodemailer from "nodemailer"

// Test the nodemailer import
const testTransporter = nodemailer.createTransport({
  host: "smtp.example.com",
  port: 587,
  secure: false,
  auth: {
    user: "test@example.com",
    pass: "password",
  },
})

console.log("Nodemailer test successful") 