CREATE TABLE "categories" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	CONSTRAINT "categories_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "conversations" (
	"id" serial PRIMARY KEY NOT NULL,
	"listingId" integer NOT NULL,
	"buyerUsername" varchar(255) NOT NULL,
	"sellerUsername" varchar(255) NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "listings" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"price" numeric(10, 2) NOT NULL,
	"condition" varchar(50) NOT NULL,
	"categoryId" integer,
	"deliveryCost" numeric(10, 2),
	"status" varchar(20) DEFAULT 'active',
	"listedAt" timestamp DEFAULT now() NOT NULL,
	"sellerUsername" varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "messages" (
	"id" serial PRIMARY KEY NOT NULL,
	"content" text NOT NULL,
	"sentAt" timestamp DEFAULT now() NOT NULL,
	"readAt" timestamp,
	"conversationId" integer,
	"senderUsername" varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "offers" (
	"id" serial PRIMARY KEY NOT NULL,
	"amount" numeric(10, 2) NOT NULL,
	"status" varchar(20) DEFAULT 'pending',
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"buyerUsername" varchar(255) NOT NULL,
	"listingId" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "reviews" (
	"id" serial PRIMARY KEY NOT NULL,
	"content" text NOT NULL,
	"rating" integer,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"reviewerUsername" varchar(255) NOT NULL,
	"listingId" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "transactions" (
	"id" serial PRIMARY KEY NOT NULL,
	"finalAmount" numeric(10, 2) NOT NULL,
	"status" varchar(20) DEFAULT 'pending',
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"buyerUsername" varchar(255) NOT NULL,
	"listingId" integer NOT NULL
);
--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "createdAt" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "lastActive" timestamp;--> statement-breakpoint
ALTER TABLE "conversations" ADD CONSTRAINT "conversations_listingId_listings_id_fk" FOREIGN KEY ("listingId") REFERENCES "public"."listings"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "conversations" ADD CONSTRAINT "conversations_buyerUsername_users_username_fk" FOREIGN KEY ("buyerUsername") REFERENCES "public"."users"("username") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "conversations" ADD CONSTRAINT "conversations_sellerUsername_users_username_fk" FOREIGN KEY ("sellerUsername") REFERENCES "public"."users"("username") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "listings" ADD CONSTRAINT "listings_categoryId_categories_id_fk" FOREIGN KEY ("categoryId") REFERENCES "public"."categories"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "listings" ADD CONSTRAINT "listings_sellerUsername_users_username_fk" FOREIGN KEY ("sellerUsername") REFERENCES "public"."users"("username") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_conversationId_conversations_id_fk" FOREIGN KEY ("conversationId") REFERENCES "public"."conversations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_senderUsername_users_username_fk" FOREIGN KEY ("senderUsername") REFERENCES "public"."users"("username") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "offers" ADD CONSTRAINT "offers_buyerUsername_users_username_fk" FOREIGN KEY ("buyerUsername") REFERENCES "public"."users"("username") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "offers" ADD CONSTRAINT "offers_listingId_listings_id_fk" FOREIGN KEY ("listingId") REFERENCES "public"."listings"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_reviewerUsername_users_username_fk" FOREIGN KEY ("reviewerUsername") REFERENCES "public"."users"("username") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_listingId_listings_id_fk" FOREIGN KEY ("listingId") REFERENCES "public"."listings"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_buyerUsername_users_username_fk" FOREIGN KEY ("buyerUsername") REFERENCES "public"."users"("username") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_listingId_listings_id_fk" FOREIGN KEY ("listingId") REFERENCES "public"."listings"("id") ON DELETE no action ON UPDATE no action;