import { pgTable, text, serial, integer, boolean, timestamp, json, foreignKey, primaryKey } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { relations } from "drizzle-orm";
import { z } from "zod";

// User model
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  phone: text("phone").notNull().unique(),
  notificationsEnabled: boolean("notifications_enabled").default(true),
});

export const insertUserSchema = createInsertSchema(users).pick({
  firstName: true,
  lastName: true,
  username: true,
  password: true,
  email: true,
  phone: true,
  notificationsEnabled: true,
});

// Habit model
export const habits = pgTable("habits", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  description: text("description"),
  startDate: timestamp("start_date").notNull(),
  routineId: integer("routine_id"),
  timeOfDay: text("time_of_day").notNull(), // Format: "HH:MM"
  completed: boolean("completed").default(false),
  frequency: json("frequency").notNull(), // Array of days: ["monday", "wednesday", "friday"]
  reminderEnabled: boolean("reminder_enabled").default(true),
});

export const insertHabitSchema = createInsertSchema(habits).pick({
  userId: true,
  name: true,
  description: true,
  startDate: true,
  routineId: true,
  timeOfDay: true,
  completed: true,
  frequency: true,
  reminderEnabled: true,
});

// Routine model
export const routines = pgTable("routines", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  description: text("description"),
  timeStart: text("time_start").notNull(), // Format: "HH:MM"
  timeEnd: text("time_end").notNull(), // Format: "HH:MM"
  type: text("type").notNull(), // "morning", "work", "evening", "custom"
});

export const insertRoutineSchema = createInsertSchema(routines).pick({
  userId: true,
  name: true,
  description: true,
  timeStart: true,
  timeEnd: true,
  type: true,
});

// HabitLog model - to track completed habits
export const habitLogs = pgTable("habit_logs", {
  id: serial("id").primaryKey(),
  habitId: integer("habit_id")
    .notNull()
    .references(() => habits.id, { onDelete: "cascade" }),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  date: timestamp("date").notNull(),
  completed: boolean("completed").notNull().default(false),
});

export const insertHabitLogSchema = createInsertSchema(habitLogs).pick({
  habitId: true,
  userId: true,
  date: true,
  completed: true,
});

// Notification model
export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  habitId: integer("habit_id").references(() => habits.id, { onDelete: "set null" }),
  routineId: integer("routine_id").references(() => routines.id, { onDelete: "set null" }),
  message: text("message").notNull(),
  scheduledTime: timestamp("scheduled_time").notNull(),
  sent: boolean("sent").default(false),
});

export const insertNotificationSchema = createInsertSchema(notifications).pick({
  userId: true,
  habitId: true,
  routineId: true,
  message: true,
  scheduledTime: true,
  sent: true,
});

// Define relations for each model
export const usersRelations = relations(users, ({ many }) => ({
  habits: many(habits),
  routines: many(routines),
  habitLogs: many(habitLogs),
  notifications: many(notifications),
}));

export const habitsRelations = relations(habits, ({ one, many }) => ({
  user: one(users, {
    fields: [habits.userId],
    references: [users.id],
  }),
  routine: one(routines, {
    fields: [habits.routineId],
    references: [routines.id],
  }),
  logs: many(habitLogs),
  notifications: many(notifications),
}));

export const routinesRelations = relations(routines, ({ one, many }) => ({
  user: one(users, {
    fields: [routines.userId],
    references: [users.id],
  }),
  habits: many(habits),
  notifications: many(notifications),
}));

export const habitLogsRelations = relations(habitLogs, ({ one }) => ({
  habit: one(habits, {
    fields: [habitLogs.habitId],
    references: [habits.id],
  }),
  user: one(users, {
    fields: [habitLogs.userId],
    references: [users.id],
  }),
}));

export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(users, {
    fields: [notifications.userId],
    references: [users.id],
  }),
  habit: one(habits, {
    fields: [notifications.habitId],
    references: [habits.id],
  }),
  routine: one(routines, {
    fields: [notifications.routineId],
    references: [routines.id],
  }),
}));

// Define TypeScript types for each model
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Habit = typeof habits.$inferSelect;
export type InsertHabit = z.infer<typeof insertHabitSchema>;

export type Routine = typeof routines.$inferSelect;
export type InsertRoutine = z.infer<typeof insertRoutineSchema>;

export type HabitLog = typeof habitLogs.$inferSelect;
export type InsertHabitLog = z.infer<typeof insertHabitLogSchema>;

export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = z.infer<typeof insertNotificationSchema>;
