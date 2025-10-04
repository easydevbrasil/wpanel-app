import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export const plans = pgTable("plans", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull().unique(),
  cashDiscount: integer("cash_discount").notNull().default(0),
  installmentDiscount: integer("installment_discount").notNull().default(0),
  subscriptionDiscount: integer("subscription_discount").notNull().default(0),
  colorFrom: text("color_from").notNull().default("blue-500"),
  colorTo: text("color_to").notNull().default("purple-600"),
});

export const insertPlanSchema = createInsertSchema(plans).omit({
  id: true,
});

export type InsertPlan = z.infer<typeof insertPlanSchema>;
export type Plan = typeof plans.$inferSelect;

export const sales = pgTable("sales", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  billingType: text("billing_type").notNull(),
  customer: text("customer").notNull(),
  value: integer("value").notNull(),
  dueDate: text("due_date").notNull(),
  description: text("description"),
  daysAfterDueDateToRegistrationCancellation: integer("days_after_due_date_to_registration_cancellation"),
  externalReference: text("external_reference"),
  installmentCount: integer("installment_count"),
  totalValue: integer("total_value"),
  installmentValue: integer("installment_value"),
  discountValue: integer("discount_value"),
  discountDueDateLimitDays: integer("discount_due_date_limit_days"),
});

export const insertSaleSchema = createInsertSchema(sales).omit({
  id: true,
});

export type InsertSale = z.infer<typeof insertSaleSchema>;
export type Sale = typeof sales.$inferSelect;
