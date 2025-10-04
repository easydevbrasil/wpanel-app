import { type User, type InsertUser, type Plan, type InsertPlan, type Sale, type InsertSale } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getPlans(): Promise<Plan[]>;
  getPlan(id: string): Promise<Plan | undefined>;
  createPlan(plan: InsertPlan): Promise<Plan>;
  updatePlan(id: string, plan: Partial<InsertPlan>): Promise<Plan | undefined>;
  deletePlan(id: string): Promise<boolean>;

  getSales(): Promise<Sale[]>;
  getSale(id: string): Promise<Sale | undefined>;
  createSale(sale: InsertSale): Promise<Sale>;
  updateSale(id: string, sale: Partial<InsertSale>): Promise<Sale | undefined>;
  deleteSale(id: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private plans: Map<string, Plan>;
  private sales: Map<string, Sale>;

  constructor() {
    this.users = new Map();
    this.plans = new Map();
    this.sales = new Map();
    
    const defaultPlans: Plan[] = [
      { id: randomUUID(), name: "Platinum", cashDiscount: 15, installmentDiscount: 10, subscriptionDiscount: 20 },
      { id: randomUUID(), name: "Gold", cashDiscount: 10, installmentDiscount: 7, subscriptionDiscount: 15 },
      { id: randomUUID(), name: "Bronze", cashDiscount: 5, installmentDiscount: 3, subscriptionDiscount: 10 },
    ];
    
    defaultPlans.forEach(plan => this.plans.set(plan.id, plan));
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  async getPlans(): Promise<Plan[]> {
    return Array.from(this.plans.values());
  }
  
  async getPlan(id: string): Promise<Plan | undefined> {
    return this.plans.get(id);
  }
  
  async createPlan(insertPlan: InsertPlan): Promise<Plan> {
    const id = randomUUID();
    const plan: Plan = { 
      id,
      name: insertPlan.name,
      cashDiscount: insertPlan.cashDiscount ?? 0,
      installmentDiscount: insertPlan.installmentDiscount ?? 0,
      subscriptionDiscount: insertPlan.subscriptionDiscount ?? 0,
    };
    this.plans.set(id, plan);
    return plan;
  }
  
  async updatePlan(id: string, updates: Partial<InsertPlan>): Promise<Plan | undefined> {
    const existing = this.plans.get(id);
    if (!existing) return undefined;
    
    const updated: Plan = { ...existing, ...updates };
    this.plans.set(id, updated);
    return updated;
  }
  
  async deletePlan(id: string): Promise<boolean> {
    return this.plans.delete(id);
  }

  async getSales(): Promise<Sale[]> {
    return Array.from(this.sales.values());
  }
  
  async getSale(id: string): Promise<Sale | undefined> {
    return this.sales.get(id);
  }
  
  async createSale(insertSale: InsertSale): Promise<Sale> {
    const id = randomUUID();
    const sale: Sale = { 
      id,
      billingType: insertSale.billingType,
      customer: insertSale.customer,
      value: insertSale.value,
      dueDate: insertSale.dueDate,
      description: insertSale.description ?? null,
      daysAfterDueDateToRegistrationCancellation: insertSale.daysAfterDueDateToRegistrationCancellation ?? null,
      externalReference: insertSale.externalReference ?? null,
      installmentCount: insertSale.installmentCount ?? null,
      totalValue: insertSale.totalValue ?? null,
      installmentValue: insertSale.installmentValue ?? null,
      discountValue: insertSale.discountValue ?? null,
      discountDueDateLimitDays: insertSale.discountDueDateLimitDays ?? null,
    };
    this.sales.set(id, sale);
    return sale;
  }
  
  async updateSale(id: string, updates: Partial<InsertSale>): Promise<Sale | undefined> {
    const existing = this.sales.get(id);
    if (!existing) return undefined;
    
    const updated: Sale = { ...existing, ...updates };
    this.sales.set(id, updated);
    return updated;
  }
  
  async deleteSale(id: string): Promise<boolean> {
    return this.sales.delete(id);
  }
}

export const storage = new MemStorage();
