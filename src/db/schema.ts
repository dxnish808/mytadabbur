import {
  pgTable,
  uuid,
  varchar,
  text,
  integer,
  boolean,
  date,
  timestamp,
} from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'

// ─── Users ───────────────────────────────────────────────
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  clerkId: varchar('clerk_id', { length: 255 }).notNull().unique(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  avatarUrl: varchar('avatar_url', { length: 500 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export const usersRelations = relations(users, ({ many }) => ({
  journalEntries: many(journalEntries),
  readingProgress: many(readingProgress),
  khatamCycles: many(khatamCycles),
  dailyStreaks: many(dailyStreaks),
}))

// ─── Journal Entries ─────────────────────────────────────
export const journalEntries = pgTable('journal_entries', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .references(() => users.id)
    .notNull(),
  surahNumber: integer('surah_number').notNull(),
  surahName: varchar('surah_name', { length: 100 }).notNull(),
  ayahStart: integer('ayah_start'),
  ayahEnd: integer('ayah_end'),
  reflection: text('reflection').notNull(),
  mood: varchar('mood', { length: 50 }),
  tags: varchar('tags', { length: 500 }),
  date: date('date').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export const journalEntriesRelations = relations(
  journalEntries,
  ({ one }) => ({
    user: one(users, {
      fields: [journalEntries.userId],
      references: [users.id],
    }),
  }),
)

// ─── Reading Progress ────────────────────────────────────
export const readingProgress = pgTable('reading_progress', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .references(() => users.id)
    .notNull(),
  type: varchar('type', { length: 10 }).notNull(), // "juz" or "surah"
  number: integer('number').notNull(),
  completed: boolean('completed').default(false).notNull(),
  completedDate: date('completed_date'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export const readingProgressRelations = relations(
  readingProgress,
  ({ one }) => ({
    user: one(users, {
      fields: [readingProgress.userId],
      references: [users.id],
    }),
  }),
)

// ─── Khatam Cycles ───────────────────────────────────────
export const khatamCycles = pgTable('khatam_cycles', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .references(() => users.id)
    .notNull(),
  cycleNumber: integer('cycle_number').notNull(),
  label: varchar('label', { length: 100 }),
  startDate: date('start_date').notNull(),
  endDate: date('end_date'),
  totalDays: integer('total_days'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export const khatamCyclesRelations = relations(khatamCycles, ({ one }) => ({
  user: one(users, {
    fields: [khatamCycles.userId],
    references: [users.id],
  }),
}))

// ─── Daily Streaks ───────────────────────────────────────
export const dailyStreaks = pgTable('daily_streaks', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .references(() => users.id)
    .notNull(),
  date: date('date').notNull(),
  pagesRead: integer('pages_read').default(0),
  minutesSpent: integer('minutes_spent').default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export const dailyStreaksRelations = relations(dailyStreaks, ({ one }) => ({
  user: one(users, {
    fields: [dailyStreaks.userId],
    references: [users.id],
  }),
}))
