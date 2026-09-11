import { createHash, randomBytes } from "node:crypto";

export const generateToken = ()=>{
    const token = randomBytes(32).toString("hex")
    return token
}

export const hashToken = (token:string)=>{
    const hashedToken = createHash("sha256").update(token).digest("hex")
    return hashedToken
}