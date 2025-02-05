import {
  integer,
  numeric,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  username: varchar({ length: 255 }).primaryKey(),
  name: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  password: varchar({ length: 255 }).notNull(),
  description: text(),
  createdAt: timestamp().notNull().defaultNow(),
  lastActive: timestamp(), // if we have time to add this into the chat page.
});

export const categoriesTable = pgTable("categories", {
  id: serial().primaryKey(),
  name: varchar({ length: 255 }).notNull().unique(),
});

export const listingsPhotosTable = pgTable("listingPhotos", {
  id: serial().primaryKey(),
  link: text().notNull(),
});

export const listingsTable = pgTable("listings", {
  id: serial().primaryKey(),
  title: text().notNull(),
  description: text().notNull(),
  price: numeric({ precision: 10, scale: 2 }).notNull(),
  condition: varchar({ length: 50 }).notNull(), // enum: ["new", "like_new", "used", "heavily)used"]
  categoryId: integer().references(() => categoriesTable.id),
  deliveryCost: numeric({ precision: 10, scale: 2 }),
  status: varchar({ length: 20 }).default("active"), // active/sold/expired
  listedAt: timestamp().notNull().defaultNow(),
  sellerUsername: varchar({ length: 255 })
    .references(() => usersTable.username)
    .notNull(),
});

export const imagesTable = pgTable("images", {
  id: serial().primaryKey(),
  url: varchar({ length: 512 }).notNull(),
  position: integer().notNull().default(1),
  listingId: integer()
    .references(() => listingsTable.id, { onDelete: "cascade" })
    .notNull(),
  createdAt: timestamp().notNull().defaultNow(),
});

export const messagesTable = pgTable("messages", {
  id: serial().primaryKey(),
  content: text().notNull(),
  sentAt: timestamp().notNull().defaultNow(),
  readAt: timestamp(),
  conversationId: integer().references(() => conversationTable.id),
  senderUsername: varchar({ length: 255 })
    .notNull()
    .references(() => usersTable.username),
});

export const reviewsTable = pgTable("reviews", {
  id: serial().primaryKey(),
  content: text().notNull(),
  rating: integer(),
  createdAt: timestamp().notNull().defaultNow(),
  reviewerUsername: varchar({ length: 255 })
    .references(() => usersTable.username)
    .notNull(),
  listingId: integer()
    .references(() => listingsTable.id)
    .notNull(),
});

export const offersTable = pgTable("offers", {
  id: serial().primaryKey(),
  amount: numeric({ precision: 10, scale: 2 }).notNull(),
  status: varchar({ length: 20 }).default("pending"),
  createdAt: timestamp().notNull().defaultNow(),
  buyerUsername: varchar({ length: 255 })
    .references(() => usersTable.username)
    .notNull(),
  listingId: integer()
    .references(() => listingsTable.id)
    .notNull(),
});

export const transactionsTable = pgTable("transactions", {
  id: serial().primaryKey(),
  finalAmount: numeric({ precision: 10, scale: 2 }).notNull(),
  status: varchar({ length: 20 }).default("pending"),
  createdAt: timestamp().notNull().defaultNow(),
  buyerUsername: varchar({ length: 255 })
    .references(() => usersTable.username)
    .notNull(),
  listingId: integer()
    .references(() => listingsTable.id)
    .notNull(),
});

export const conversationTable = pgTable("conversations", {
  id: serial().primaryKey(),
  listingId: integer()
    .references(() => listingsTable.id)
    .notNull(),
  buyerUsername: varchar({ length: 255 })
    .references(() => usersTable.username)
    .notNull(),
  sellerUsername: varchar({ length: 255 })
    .references(() => usersTable.username)
    .notNull(),
  createdAt: timestamp().notNull().defaultNow(),
  updatedAt: timestamp().notNull().defaultNow(),
});
