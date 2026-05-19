import { integer, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const urlTable = pgTable("url", {
    id: serial("id").primaryKey(),
    shortUrl: text("short_url").notNull(),
    longUrl: text("long_url").notNull(),
    clicks: integer("clicks").notNull().default(0),
    createdAt: timestamp("created_at").defaultNow(),
});

export type Url = typeof urlTable.$inferSelect;
export type NewUrl = typeof urlTable.$inferInsert;