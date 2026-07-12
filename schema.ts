import {
  pgTable,
  serial,
  varchar,
  text,
  timestamp,
  integer,
  boolean,
  pgEnum,
} from "drizzle-orm/pg-core";

export const playerStatusEnum = pgEnum("player_status", [
  "available",
  "injured",
  "suspended",
  "resting",
]);

export const positionEnum = pgEnum("position", [
  "goalkeeper",
  "defender",
  "midfielder",
  "forward",
]);

export const matchStatusEnum = pgEnum("match_status", [
  "upcoming",
  "live",
  "completed",
  "cancelled",
]);

export const eventTypeEnum = pgEnum("event_type", [
  "training",
  "meeting",
  "social",
  "travel",
  "medical",
  "other",
]);

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  role: varchar("role", { length: 50 }).notNull().default("manager"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const players = pgTable("players", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  number: integer("number").notNull(),
  position: positionEnum("position").notNull(),
  status: playerStatusEnum("status").notNull().default("available"),
  age: integer("age").notNull(),
  nationality: varchar("nationality", { length: 100 }).notNull(),
  imageUrl: text("image_url"),
  goals: integer("goals").notNull().default(0),
  assists: integer("assists").notNull().default(0),
  appearances: integer("appearances").notNull().default(0),
  injuryNote: text("injury_note"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const matches = pgTable("matches", {
  id: serial("id").primaryKey(),
  opponent: varchar("opponent", { length: 255 }).notNull(),
  venue: varchar("venue", { length: 255 }).notNull(),
  date: timestamp("date").notNull(),
  status: matchStatusEnum("status").notNull().default("upcoming"),
  homeScore: integer("home_score"),
  awayScore: integer("away_score"),
  competition: varchar("competition", { length: 255 }).notNull(),
  isHome: boolean("is_home").notNull().default(true),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const squadSelections = pgTable("squad_selections", {
  id: serial("id").primaryKey(),
  matchId: integer("match_id")
    .references(() => matches.id, { onDelete: "cascade" })
    .notNull(),
  playerId: integer("player_id")
    .references(() => players.id, { onDelete: "cascade" })
    .notNull(),
  isStarter: boolean("is_starter").notNull().default(false),
  positionOverride: varchar("position_override", { length: 50 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const events = pgTable("events", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  type: eventTypeEnum("type").notNull(),
  date: timestamp("date").notNull(),
  endDate: timestamp("end_date"),
  location: varchar("location", { length: 255 }),
  isAllDay: boolean("is_all_day").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Player = typeof players.$inferSelect;
export type NewPlayer = typeof players.$inferInsert;
export type Match = typeof matches.$inferSelect;
export type NewMatch = typeof matches.$inferInsert;
export type SquadSelection = typeof squadSelections.$inferSelect;
export type NewSquadSelection = typeof squadSelections.$inferInsert;
export type Event = typeof events.$inferSelect;
export type NewEvent = typeof events.$inferInsert;
