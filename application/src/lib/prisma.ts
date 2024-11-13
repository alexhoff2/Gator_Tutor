//Manages connections to database
import { PrismaClient } from "@prisma/client";

//Create a single instance to be shared
export const prisma = new PrismaClient();
