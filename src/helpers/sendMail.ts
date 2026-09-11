import { emailTransport } from "./emailTransport.js";
import config from "../config/config.js";

export const sendMail = async(to:string,subject:string,html:string)=>{
    await emailTransport.sendMail({
        from:config.email_user,
        to,
        subject,
        html
    })
}