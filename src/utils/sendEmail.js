 import nodemailer from "nodemailer";
 import { getEnvVar } from "../utils/getEnvVar.js";
 const transporter = nodemailer.createTransport({
    host: getEnvVar("SMTP_HOST"),
    port: getEnvVar("SMTP_PORT"),
    secure: false,
    auth: {
        user: getEnvVar("SMTP_USER"),
        pass: getEnvVar("SMTP_PASSWORD"),
    },
 })

 export function sendEmail( to, subject, content ){
    return  transporter.sendMail({
        from: "",
        to,
        subject,
        html: content 
    })
 }