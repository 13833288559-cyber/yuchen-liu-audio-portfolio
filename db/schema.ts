import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const settings = sqliteTable("settings", { key:text("key").primaryKey(), value:text("value").notNull() });
export const portfolioItems = sqliteTable("portfolio_items", { id:integer("id").primaryKey({autoIncrement:true}), title:text("title").notNull(), category:text("category").notNull(), description:text("description").notNull().default(""), mediaKey:text("media_key").notNull(), mediaType:text("media_type").notNull(), fileName:text("file_name").notNull(), createdAt:text("created_at").notNull().default("CURRENT_TIMESTAMP") });
export const siteOwner = sqliteTable("site_owner", { id:integer("id").primaryKey(), email:text("email").notNull() });
