import {pgTable, text, varchar} from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  username: varchar({ length: 255}).primaryKey(),
  name: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  password: varchar({length: 255}).notNull(),
  description: text()
});
