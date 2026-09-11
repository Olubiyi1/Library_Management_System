import dotenv from "dotenv"
dotenv.config()
import {PrismaClient } from "../generated/prisma/client.js"
import { PrismaPg } from "@prisma/adapter-pg"

const databaseUrl =  process.env.DATABASE_URL

if(!databaseUrl){
    throw new Error("Database_url is not defined")
}

const adapter = new PrismaPg({
    connectionString:databaseUrl
})

const prisma = new PrismaClient({
    adapter,
    log:["query","info","warn","error"]
})

export default prisma;