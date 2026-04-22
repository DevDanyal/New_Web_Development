import { pgTable, serial, varchar, text, jsonb, timestamp } from 'drizzle-orm/pg-core';

export const leads = pgTable('leads', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  name: varchar('name', { length: 255 }),
  projectType: varchar('project_type', { length: 50 }),
  timeline: varchar('timeline', { length: 50 }),
  budgetRange: varchar('budget_range', { length: 50 }),
  message: text('message'),
  conversationHistory: jsonb('conversation_history'),
  source: varchar('source', { length: 50 }).default('chatbot'),
  status: varchar('status', { length: 50 }).default('new'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const contactSubmissions = pgTable('contact_submissions', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  subject: varchar('subject', { length: 255 }),
  message: text('message').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});
