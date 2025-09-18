ALTER TABLE "users" ALTER COLUMN "userid" SET DATA TYPE serial;--> statement-breakpoint
ALTER TABLE "companyusers" ALTER COLUMN "companyuserid" SET DATA TYPE serial;--> statement-breakpoint
ALTER TABLE "companies" ALTER COLUMN "companyid" SET DATA TYPE serial;--> statement-breakpoint
ALTER TABLE "combos" ALTER COLUMN "comboid" SET DATA TYPE serial;--> statement-breakpoint
ALTER TABLE "adminusers" ALTER COLUMN "adminuserid" SET DATA TYPE serial;--> statement-breakpoint
ALTER TABLE "categories" ALTER COLUMN "categoryid" SET DATA TYPE serial;--> statement-breakpoint
ALTER TABLE "comboitems" ALTER COLUMN "comboitemid" SET DATA TYPE serial;--> statement-breakpoint
ALTER TABLE "products" ALTER COLUMN "productid" SET DATA TYPE serial;--> statement-breakpoint
ALTER TABLE "productinventory" ALTER COLUMN "inventoryid" SET DATA TYPE serial;--> statement-breakpoint
ALTER TABLE "offers" ALTER COLUMN "offerid" SET DATA TYPE serial;--> statement-breakpoint
ALTER TABLE "offerapplications" ALTER COLUMN "offerappid" SET DATA TYPE serial;--> statement-breakpoint
ALTER TABLE "orders" ALTER COLUMN "orderid" SET DATA TYPE serial;--> statement-breakpoint
ALTER TABLE "orderitems" ALTER COLUMN "orderitemid" SET DATA TYPE serial;--> statement-breakpoint
ALTER TABLE "transactions" ALTER COLUMN "transactionid" SET DATA TYPE serial;--> statement-breakpoint
ALTER TABLE "paymentgateways" ALTER COLUMN "paymentgatewayid" SET DATA TYPE serial;--> statement-breakpoint
ALTER TABLE "paymentmethods" ALTER COLUMN "paymentmethodid" SET DATA TYPE serial;--> statement-breakpoint
ALTER TABLE "notifications" ALTER COLUMN "notificationid" SET DATA TYPE serial;--> statement-breakpoint
ALTER TABLE "reports" ALTER COLUMN "reportid" SET DATA TYPE serial;--> statement-breakpoint
ALTER TABLE "companyregistrationrequests" ALTER COLUMN "requestid" SET DATA TYPE serial;--> statement-breakpoint
ALTER TABLE "combo_price_analysis" ADD PRIMARY KEY ("comboid");--> statement-breakpoint
ALTER TABLE "combo_price_analysis" ALTER COLUMN "comboid" SET DATA TYPE serial;--> statement-breakpoint
ALTER TABLE "combo_price_analysis" ALTER COLUMN "comboid" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "companies" ADD COLUMN "status" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "combos" ADD COLUMN "companyid" integer;--> statement-breakpoint
ALTER TABLE "combos" ADD COLUMN "image" varchar(255);--> statement-breakpoint
ALTER TABLE "categories" ADD COLUMN "image" varchar(255);--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "companyid" integer;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "image" varchar(255);--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "createdby" integer DEFAULT 1;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "combos" ADD CONSTRAINT "company_id_fkey" FOREIGN KEY ("companyid") REFERENCES "public"."companies"("companyid") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "products" ADD CONSTRAINT "created_by_userid_fkey" FOREIGN KEY ("createdby") REFERENCES "public"."users"("userid") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "products" ADD CONSTRAINT "company_id_fkey" FOREIGN KEY ("companyid") REFERENCES "public"."companies"("companyid") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
