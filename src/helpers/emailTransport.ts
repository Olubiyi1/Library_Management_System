import nodemailer from "nodemailer";
import config from "../config/config.js";

export const emailTransport = nodemailer.createTransport({
    host:"smtp.gmail.com",
    port:465,
    secure:true,
    auth:{
        user:config.email_user,
        pass:config.email_password
    }
})