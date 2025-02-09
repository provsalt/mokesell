CREATE TABLE "listingPhotos" (
	"id" serial PRIMARY KEY NOT NULL,
	"link" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "lastActive" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "lastDailyReward" timestamp;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "balance" numeric(10, 2);