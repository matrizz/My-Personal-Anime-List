import { PrismaClient  } from "@prisma/client";
import type { Anime } from "@prisma/client";

const prisma = new PrismaClient();

export default prisma
export type {
    Anime
}