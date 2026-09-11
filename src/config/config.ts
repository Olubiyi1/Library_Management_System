import dotenv from "dotenv"
dotenv.config()

export default{
  redis_host:process.env.REDIS_HOST,
  redis_port:Number(process.env.REDIS_PORT),
  email_user:process.env.EMAIL_USER as string,
  email_password:process.env.EMAIL_PASSWORD as string,
  access_token_secret_key:process.env.ACCESS_TOKEN_SECRET_KEY as string,
  refresh_token_secret_key:process.env.REFRESH_TOKEN_SECRET_KEY as string,
}
