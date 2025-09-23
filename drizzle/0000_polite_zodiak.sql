CREATE TABLE "bookings" (
	"id" integer PRIMARY KEY NOT NULL,
	"vehicleId" integer NOT NULL,
	"startDate" date NOT NULL,
	"endDate" date NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "users_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar(255) NOT NULL,
	"age" varchar(3) NOT NULL,
	"email" varchar(255),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "vehicles" (
	"id" integer PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"vehicle_type_id" integer
);
--> statement-breakpoint
CREATE TABLE "vehicleType" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "vehicleType_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar(255) NOT NULL,
	CONSTRAINT "vehicleType_name_unique" UNIQUE("name")
);
--> statement-breakpoint
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_vehicleId_vehicles_id_fk" FOREIGN KEY ("vehicleId") REFERENCES "public"."vehicles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vehicles" ADD CONSTRAINT "vehicles_vehicle_type_id_vehicleType_id_fk" FOREIGN KEY ("vehicle_type_id") REFERENCES "public"."vehicleType"("id") ON DELETE no action ON UPDATE no action;