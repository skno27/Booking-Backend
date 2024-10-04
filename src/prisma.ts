import { PrismaClient } from "@prisma/client";
import env from "dotenv";
env.config();

let prisma = new PrismaClient();

export default prisma;
