import { PrismaClient } from "./prisma/client";
import {PrismaPg} from "@prisma/adapter-pg"


const globalPartition= globalThis as unknown as{
    prisma: PrismaClient | undefined
}

const connectionString = process.env.DATABASE_URL

if (!connectionString){
    throw new Error("Database url is not working")
}

const adapter = new PrismaPg({connectionString})

const prisma = globalPartition.prisma ?? new PrismaClient({adapter}) ;

if  (process.env.NODE_ENV !== "production"){
    globalPartition.prisma =prisma
}


export {prisma}