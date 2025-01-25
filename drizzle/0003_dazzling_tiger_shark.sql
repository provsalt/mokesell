CREATE TABLE "images" (
	"id" serial PRIMARY KEY NOT NULL,
	"url" varchar(512) NOT NULL,
	"position" integer DEFAULT 1 NOT NULL,
	"listingId" integer NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "images" ADD CONSTRAINT "images_listingId_listings_id_fk" FOREIGN KEY ("listingId") REFERENCES "public"."listings"("id") ON DELETE cascade ON UPDATE no action;