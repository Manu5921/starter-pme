import {
  boolean,
  integer,
  pgTable,
  text,
  timestamp,
  json,
  decimal,
  date,
} from "drizzle-orm/pg-core";

// Better Auth Tables
export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("emailVerified").notNull().default(false),
  image: text("image"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
});

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expiresAt").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
  ipAddress: text("ipAddress"),
  userAgent: text("userAgent"),
  userId: text("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("accountId").notNull(),
  providerId: text("providerId").notNull(),
  userId: text("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("accessToken"),
  refreshToken: text("refreshToken"),
  idToken: text("idToken"),
  accessTokenExpiresAt: timestamp("accessTokenExpiresAt"),
  refreshTokenExpiresAt: timestamp("refreshTokenExpiresAt"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expiresAt").notNull(),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
});

// Subscription table for Polar webhook data
export const subscription = pgTable("subscription", {
  id: text("id").primaryKey(),
  createdAt: timestamp("createdAt").notNull(),
  modifiedAt: timestamp("modifiedAt"),
  amount: integer("amount").notNull(),
  currency: text("currency").notNull(),
  recurringInterval: text("recurringInterval").notNull(),
  status: text("status").notNull(),
  currentPeriodStart: timestamp("currentPeriodStart").notNull(),
  currentPeriodEnd: timestamp("currentPeriodEnd").notNull(),
  cancelAtPeriodEnd: boolean("cancelAtPeriodEnd").notNull().default(false),
  canceledAt: timestamp("canceledAt"),
  startedAt: timestamp("startedAt").notNull(),
  endsAt: timestamp("endsAt"),
  endedAt: timestamp("endedAt"),
  customerId: text("customerId").notNull(),
  productId: text("productId").notNull(),
  discountId: text("discountId"),
  checkoutId: text("checkoutId").notNull(),
  customerCancellationReason: text("customerCancellationReason"),
  customerCancellationComment: text("customerCancellationComment"),
  metadata: text("metadata"), // JSON string
  customFieldData: text("customFieldData"), // JSON string
  userId: text("userId").references(() => user.id),
});

// Website Builder Platform Tables

// Clients table - stores information about each client's business
export const clients = pgTable("clients", {
  id: text("id").primaryKey(),
  businessName: text("businessName").notNull(),
  contactName: text("contactName").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  domain: text("domain").unique(),
  templateType: text("templateType").notNull(), // 'plumber', 'restaurant', 'medical'
  config: json("config").notNull(), // Complete site configuration
  status: text("status").notNull().default("development"), // 'development', 'live', 'suspended'
  monthlyFee: integer("monthlyFee").notNull().default(29), // in euros
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
  userId: text("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }), // Which admin created this client
});

// Sites table - stores deployment information for each client site
export const sites = pgTable("sites", {
  id: text("id").primaryKey(),
  clientId: text("clientId")
    .notNull()
    .references(() => clients.id, { onDelete: "cascade" }),
  domain: text("domain").notNull(),
  vercelDeploymentId: text("vercelDeploymentId"),
  vercelProjectId: text("vercelProjectId"),
  status: text("status").notNull().default("building"), // 'building', 'ready', 'error', 'maintenance'
  deployedAt: timestamp("deployedAt"),
  lastBuildAt: timestamp("lastBuildAt").notNull().defaultNow(),
  buildLogs: text("buildLogs"),
  performanceScore: integer("performanceScore"), // Lighthouse score
  seoScore: integer("seoScore"), // SEO score
  accessibilityScore: integer("accessibilityScore"), // Accessibility score
  ssl: boolean("ssl").notNull().default(true),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
});

// Site analytics table - basic analytics for client sites
export const siteAnalytics = pgTable("siteAnalytics", {
  id: text("id").primaryKey(),
  siteId: text("siteId")
    .notNull()
    .references(() => sites.id, { onDelete: "cascade" }),
  date: date("date").notNull(),
  pageViews: integer("pageViews").notNull().default(0),
  uniqueVisitors: integer("uniqueVisitors").notNull().default(0),
  bounceRate: decimal("bounceRate", { precision: 5, scale: 2 }), // 0.00 to 100.00
  avgSessionDuration: integer("avgSessionDuration"), // in seconds
  topPages: json("topPages"), // Array of {path: string, views: number}
  referrers: json("referrers"), // Array of {source: string, visits: number}
  createdAt: timestamp("createdAt").notNull().defaultNow(),
});

// Payments table - track payments for setup and monthly fees
export const payments = pgTable("payments", {
  id: text("id").primaryKey(),
  clientId: text("clientId")
    .notNull()
    .references(() => clients.id, { onDelete: "cascade" }),
  amount: integer("amount").notNull(), // in cents (euro)
  type: text("type").notNull(), // 'setup', 'monthly', 'annual'
  status: text("status").notNull().default("pending"), // 'pending', 'paid', 'failed', 'refunded'
  stripePaymentId: text("stripePaymentId"),
  stripeSessionId: text("stripeSessionId"),
  paidAt: timestamp("paidAt"),
  dueDate: date("dueDate"),
  description: text("description"),
  metadata: json("metadata"), // Additional payment data
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
});

// Templates table - store available templates and their usage
export const templates = pgTable("templates", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  type: text("type").notNull(), // 'plumber', 'restaurant', 'medical'
  description: text("description").notNull(),
  version: text("version").notNull().default("1.0.0"),
  config: json("config").notNull(), // Default template configuration
  features: json("features").notNull(), // Array of features
  previewImage: text("previewImage"),
  isActive: boolean("isActive").notNull().default(true),
  usageCount: integer("usageCount").notNull().default(0),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
});

// Support tickets table - for client support requests
export const supportTickets = pgTable("supportTickets", {
  id: text("id").primaryKey(),
  clientId: text("clientId")
    .notNull()
    .references(() => clients.id, { onDelete: "cascade" }),
  subject: text("subject").notNull(),
  description: text("description").notNull(),
  priority: text("priority").notNull().default("medium"), // 'low', 'medium', 'high', 'urgent'
  status: text("status").notNull().default("open"), // 'open', 'in_progress', 'resolved', 'closed'
  assignedTo: text("assignedTo").references(() => user.id),
  resolvedAt: timestamp("resolvedAt"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
});
