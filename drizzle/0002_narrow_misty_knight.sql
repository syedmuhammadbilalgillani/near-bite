CREATE TABLE IF NOT EXISTS "announcements" (
	"announcementid" serial PRIMARY KEY NOT NULL,
	"companyid" integer,
	"title" varchar(255),
	"content" text,
	"isactive" boolean DEFAULT true,
	"startdate" timestamp,
	"enddate" timestamp,
	"createdat" timestamp DEFAULT CURRENT_TIMESTAMP,
	"updatedat" timestamp DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "announcements" ADD CONSTRAINT "announcements_companyid_fkey" FOREIGN KEY ("companyid") REFERENCES "public"."companies"("companyid") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
