-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TABLE IF NOT EXISTS "users" (
	"userid" integer PRIMARY KEY NOT NULL,
	"name" varchar(255),
	"email" varchar(255),
	"password" varchar(255),
	"phonenumber" varchar(20),
	"profilepicture" varchar(255),
	"usertype" varchar(50),
	"supportid" integer,
	"geolocationradius" numeric(5, 2),
	"notificationsettings" varchar(255),
	"createdat" timestamp DEFAULT CURRENT_TIMESTAMP,
	"updatedat" timestamp DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT "users_email_key" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "companyusers" (
	"companyuserid" integer PRIMARY KEY NOT NULL,
	"userid" integer,
	"companyid" integer,
	"role" varchar(50),
	"createdat" timestamp DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "companies" (
	"companyid" integer PRIMARY KEY NOT NULL,
	"companyname" varchar(255),
	"address" varchar(255),
	"latitude" numeric(10, 8),
	"longitude" numeric(11, 8),
	"licensecompliance" boolean,
	"businesscategories" varchar(255),
	"isactive" boolean,
	"createdat" timestamp DEFAULT CURRENT_TIMESTAMP,
	"updatedat" timestamp DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "combos" (
	"comboid" integer PRIMARY KEY NOT NULL,
	"name" varchar(255),
	"description" text,
	"price" numeric(10, 2),
	"isactive" boolean,
	"startdate" timestamp,
	"enddate" timestamp,
	"createdat" timestamp DEFAULT CURRENT_TIMESTAMP,
	"updatedat" timestamp DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "adminusers" (
	"adminuserid" integer PRIMARY KEY NOT NULL,
	"userid" integer,
	"role" varchar(50),
	"permissions" text,
	"createdat" timestamp DEFAULT CURRENT_TIMESTAMP,
	"updatedat" timestamp DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "categories" (
	"categoryid" integer PRIMARY KEY NOT NULL,
	"categoryname" varchar(255),
	"parentcategoryid" integer,
	"createdat" timestamp DEFAULT CURRENT_TIMESTAMP,
	"updatedat" timestamp DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "comboitems" (
	"comboitemid" integer PRIMARY KEY NOT NULL,
	"comboid" integer,
	"productid" integer,
	"quantity" integer,
	"createdat" timestamp DEFAULT CURRENT_TIMESTAMP,
	"updatedat" timestamp DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "products" (
	"productid" integer PRIMARY KEY NOT NULL,
	"categoryid" integer,
	"name" varchar(255),
	"description" text,
	"baseprice" numeric(10, 2),
	"inqwerty" boolean,
	"isactive" boolean,
	"createdat" timestamp DEFAULT CURRENT_TIMESTAMP,
	"updatedat" timestamp DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "productinventory" (
	"inventoryid" integer PRIMARY KEY NOT NULL,
	"productid" integer,
	"quantityavailable" integer,
	"lastupdated" timestamp,
	"createdat" timestamp DEFAULT CURRENT_TIMESTAMP,
	"updatedat" timestamp DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "offers" (
	"offerid" integer PRIMARY KEY NOT NULL,
	"name" varchar(255),
	"description" text,
	"discounttype" varchar(50),
	"discountvalue" numeric(10, 2),
	"startdate" timestamp,
	"enddate" timestamp,
	"isactive" boolean,
	"createdat" timestamp DEFAULT CURRENT_TIMESTAMP,
	"updatedat" timestamp DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "offerapplications" (
	"offerappid" integer PRIMARY KEY NOT NULL,
	"offerid" integer,
	"productid" integer,
	"comboid" integer,
	"createdat" timestamp DEFAULT CURRENT_TIMESTAMP,
	"updatedat" timestamp DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "orders" (
	"orderid" integer PRIMARY KEY NOT NULL,
	"userid" integer,
	"status" varchar(50),
	"paymentstatus" varchar(50),
	"paymentmethod" varchar(50),
	"totalamount" numeric(10, 2),
	"createdat" timestamp DEFAULT CURRENT_TIMESTAMP,
	"updatedat" timestamp DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "orderitems" (
	"orderitemid" integer PRIMARY KEY NOT NULL,
	"orderid" integer,
	"productid" integer,
	"comboid" integer,
	"quantity" integer,
	"unitprice" numeric(10, 2),
	"discountapplied" boolean,
	"ordertype" varchar(20),
	"createdat" timestamp DEFAULT CURRENT_TIMESTAMP,
	"updatedat" timestamp DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "transactions" (
	"transactionid" integer PRIMARY KEY NOT NULL,
	"orderid" integer,
	"companyid" integer,
	"transactiondate" timestamp,
	"amount" numeric(10, 2),
	"paymentgatewayid" integer,
	"paymentstatus" varchar(50),
	"createdat" timestamp DEFAULT CURRENT_TIMESTAMP,
	"updatedat" timestamp DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "paymentgateways" (
	"paymentgatewayid" integer PRIMARY KEY NOT NULL,
	"gatewayname" varchar(255),
	"apikey" varchar(255),
	"apisecret" varchar(255),
	"isactive" boolean,
	"createdat" timestamp DEFAULT CURRENT_TIMESTAMP,
	"updatedat" timestamp DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "paymentmethods" (
	"paymentmethodid" integer PRIMARY KEY NOT NULL,
	"methodtype" varchar(50),
	"details" text,
	"isdefault" boolean,
	"createdat" timestamp DEFAULT CURRENT_TIMESTAMP,
	"updatedat" timestamp DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "notifications" (
	"notificationid" integer PRIMARY KEY NOT NULL,
	"userid" integer,
	"notificationtype" varchar(50),
	"message" text,
	"relatedentityid" integer,
	"isread" boolean,
	"sentat" timestamp,
	"createdat" timestamp DEFAULT CURRENT_TIMESTAMP,
	"updatedat" timestamp DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "reports" (
	"reportid" integer PRIMARY KEY NOT NULL,
	"companyid" integer,
	"reporttype" varchar(50),
	"parameters" text,
	"generatedat" timestamp,
	"createdat" timestamp DEFAULT CURRENT_TIMESTAMP,
	"updatedat" timestamp DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "companyregistrationrequests" (
	"requestid" integer PRIMARY KEY NOT NULL,
	"companyid" integer,
	"submittedbyuserid" integer,
	"applicationdate" timestamp,
	"adminuserid" integer,
	"notes" text,
	"createdat" timestamp DEFAULT CURRENT_TIMESTAMP,
	"updatedat" timestamp DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "combo_price_analysis" (
	"comboid" integer,
	"combo_name" varchar(255),
	"combo_price" numeric(10, 2),
	"total_individual_price" numeric,
	"total_savings" numeric,
	"number_of_products" bigint
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "companyusers" ADD CONSTRAINT "companyusers_userid_fkey" FOREIGN KEY ("userid") REFERENCES "public"."users"("userid") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "companyusers" ADD CONSTRAINT "companyusers_companyid_fkey" FOREIGN KEY ("companyid") REFERENCES "public"."companies"("companyid") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "adminusers" ADD CONSTRAINT "adminusers_userid_fkey" FOREIGN KEY ("userid") REFERENCES "public"."users"("userid") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "categories" ADD CONSTRAINT "categories_parentcategoryid_fkey" FOREIGN KEY ("parentcategoryid") REFERENCES "public"."categories"("categoryid") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "comboitems" ADD CONSTRAINT "comboitems_comboid_fkey" FOREIGN KEY ("comboid") REFERENCES "public"."combos"("comboid") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "comboitems" ADD CONSTRAINT "comboitems_productid_fkey" FOREIGN KEY ("productid") REFERENCES "public"."products"("productid") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "products" ADD CONSTRAINT "products_categoryid_fkey" FOREIGN KEY ("categoryid") REFERENCES "public"."categories"("categoryid") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "productinventory" ADD CONSTRAINT "productinventory_productid_fkey" FOREIGN KEY ("productid") REFERENCES "public"."products"("productid") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "offerapplications" ADD CONSTRAINT "offerapplications_offerid_fkey" FOREIGN KEY ("offerid") REFERENCES "public"."offers"("offerid") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "offerapplications" ADD CONSTRAINT "offerapplications_productid_fkey" FOREIGN KEY ("productid") REFERENCES "public"."products"("productid") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "offerapplications" ADD CONSTRAINT "offerapplications_comboid_fkey" FOREIGN KEY ("comboid") REFERENCES "public"."combos"("comboid") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "orders" ADD CONSTRAINT "orders_userid_fkey" FOREIGN KEY ("userid") REFERENCES "public"."users"("userid") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "orderitems" ADD CONSTRAINT "orderitems_orderid_fkey" FOREIGN KEY ("orderid") REFERENCES "public"."orders"("orderid") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "orderitems" ADD CONSTRAINT "orderitems_productid_fkey" FOREIGN KEY ("productid") REFERENCES "public"."products"("productid") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "orderitems" ADD CONSTRAINT "orderitems_comboid_fkey" FOREIGN KEY ("comboid") REFERENCES "public"."combos"("comboid") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "transactions" ADD CONSTRAINT "transactions_orderid_fkey" FOREIGN KEY ("orderid") REFERENCES "public"."orders"("orderid") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "transactions" ADD CONSTRAINT "transactions_companyid_fkey" FOREIGN KEY ("companyid") REFERENCES "public"."companies"("companyid") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "notifications" ADD CONSTRAINT "notifications_userid_fkey" FOREIGN KEY ("userid") REFERENCES "public"."users"("userid") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "reports" ADD CONSTRAINT "reports_companyid_fkey" FOREIGN KEY ("companyid") REFERENCES "public"."companies"("companyid") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "companyregistrationrequests" ADD CONSTRAINT "companyregistrationrequests_adminuserid_fkey" FOREIGN KEY ("adminuserid") REFERENCES "public"."adminusers"("adminuserid") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "companyregistrationrequests" ADD CONSTRAINT "companyregistrationrequests_companyid_fkey" FOREIGN KEY ("companyid") REFERENCES "public"."companies"("companyid") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "companyregistrationrequests" ADD CONSTRAINT "companyregistrationrequests_submittedbyuserid_fkey" FOREIGN KEY ("submittedbyuserid") REFERENCES "public"."users"("userid") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_comboitems_combo" ON "comboitems" USING btree ("comboid");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_products_category" ON "products" USING btree ("categoryid");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_orderitems_combo" ON "orderitems" USING btree ("comboid");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_orderitems_order" ON "orderitems" USING btree ("orderid");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_orderitems_product" ON "orderitems" USING btree ("productid");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_transactions_order" ON "transactions" USING btree ("orderid");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_notifications_user" ON "notifications" USING btree ("userid");
*/