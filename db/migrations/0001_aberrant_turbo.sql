CREATE TABLE "clients" (
	"id" text PRIMARY KEY NOT NULL,
	"businessName" text NOT NULL,
	"contactName" text NOT NULL,
	"email" text NOT NULL,
	"phone" text NOT NULL,
	"domain" text,
	"templateType" text NOT NULL,
	"config" json NOT NULL,
	"status" text DEFAULT 'development' NOT NULL,
	"monthlyFee" integer DEFAULT 29 NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"userId" text NOT NULL,
	CONSTRAINT "clients_domain_unique" UNIQUE("domain")
);
--> statement-breakpoint
CREATE TABLE "payments" (
	"id" text PRIMARY KEY NOT NULL,
	"clientId" text NOT NULL,
	"amount" integer NOT NULL,
	"type" text NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"stripePaymentId" text,
	"stripeSessionId" text,
	"paidAt" timestamp,
	"dueDate" date,
	"description" text,
	"metadata" json,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "siteAnalytics" (
	"id" text PRIMARY KEY NOT NULL,
	"siteId" text NOT NULL,
	"date" date NOT NULL,
	"pageViews" integer DEFAULT 0 NOT NULL,
	"uniqueVisitors" integer DEFAULT 0 NOT NULL,
	"bounceRate" numeric(5, 2),
	"avgSessionDuration" integer,
	"topPages" json,
	"referrers" json,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sites" (
	"id" text PRIMARY KEY NOT NULL,
	"clientId" text NOT NULL,
	"domain" text NOT NULL,
	"vercelDeploymentId" text,
	"vercelProjectId" text,
	"status" text DEFAULT 'building' NOT NULL,
	"deployedAt" timestamp,
	"lastBuildAt" timestamp DEFAULT now() NOT NULL,
	"buildLogs" text,
	"performanceScore" integer,
	"seoScore" integer,
	"accessibilityScore" integer,
	"ssl" boolean DEFAULT true NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "supportTickets" (
	"id" text PRIMARY KEY NOT NULL,
	"clientId" text NOT NULL,
	"subject" text NOT NULL,
	"description" text NOT NULL,
	"priority" text DEFAULT 'medium' NOT NULL,
	"status" text DEFAULT 'open' NOT NULL,
	"assignedTo" text,
	"resolvedAt" timestamp,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "templates" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"type" text NOT NULL,
	"description" text NOT NULL,
	"version" text DEFAULT '1.0.0' NOT NULL,
	"config" json NOT NULL,
	"features" json NOT NULL,
	"previewImage" text,
	"isActive" boolean DEFAULT true NOT NULL,
	"usageCount" integer DEFAULT 0 NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "clients" ADD CONSTRAINT "clients_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_clientId_clients_id_fk" FOREIGN KEY ("clientId") REFERENCES "public"."clients"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "siteAnalytics" ADD CONSTRAINT "siteAnalytics_siteId_sites_id_fk" FOREIGN KEY ("siteId") REFERENCES "public"."sites"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sites" ADD CONSTRAINT "sites_clientId_clients_id_fk" FOREIGN KEY ("clientId") REFERENCES "public"."clients"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "supportTickets" ADD CONSTRAINT "supportTickets_clientId_clients_id_fk" FOREIGN KEY ("clientId") REFERENCES "public"."clients"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "supportTickets" ADD CONSTRAINT "supportTickets_assignedTo_user_id_fk" FOREIGN KEY ("assignedTo") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;