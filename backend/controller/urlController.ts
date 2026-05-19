import type { Request, Response } from "express";
import { generateRandomString } from "../utils/generateRandomString.js";
import { db } from "../db.js";
import { urlTable } from "../schemas/urlSchema.js";
import { eq, sql } from "drizzle-orm";
import { maxTries } from "../constants.js";

export const createUrl = async (req: Request, res: Response): Promise<void> => {
    try {
        const { url } = req.body;

        if (!url || typeof url !== 'string') {
            res.status(400).json({ message: "A valid URL is required" });
            return;
        }

        let shortUrl: string = "";
        let isInserted = false;

        for (let i = 0; i < maxTries; i++) {
            shortUrl = generateRandomString();

            try {
                await db.insert(urlTable).values({
                    shortUrl,
                    longUrl: url,
                });

                isInserted = true;
                break;
            } catch (insertError) {
                continue;
            }
        }

        if (!isInserted) {
            res.status(503).json({ message: "Failed to generate a unique short URL after multiple attempts" });
            return;
        }

        res.status(201).json({
            message: "URL shortened successfully",
            shortUrl,
            longUrl: url,
        });
    } catch (error) {
        console.error("Error creating URL:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const getUrl = async (req: Request, res: Response): Promise<void> => {
    try {
        const { shortUrl } = req.params;
        const results = await db.select().from(urlTable).where(eq(urlTable.shortUrl, shortUrl));
        const record = results[0];

        if (!record) {
            res.status(404).json({ message: "URL not found" });
            return;
        }
        // Fire and forget — don't await, redirect immediately
        db.update(urlTable)
            .set({ clicks: sql`${urlTable.clicks} + 1` })
            .where(eq(urlTable.shortUrl, shortUrl))
            .catch((err) => console.error("Failed to increment clicks:", err));

        res.redirect(record.longUrl);
    } catch (error) {
        console.error("Error fetching URL:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}
export const getStats = async (req: Request, res: Response): Promise<void> => {
    try {
        const { shortUrl } = req.params;
        const results = await db.select({
            shortUrl: urlTable.shortUrl,
            longUrl: urlTable.longUrl,
            clicks: urlTable.clicks,
            createdAt: urlTable.createdAt,
        }).from(urlTable).where(eq(urlTable.shortUrl, shortUrl));
        const record = results[0];

        if (!record) {
            res.status(404).json({ message: "URL not found" });
            return;
        }

        res.status(200).json(record);
    } catch (error) {
        console.error("Error fetching stats:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}