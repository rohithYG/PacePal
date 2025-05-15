import { users, habits, routines, habitLogs, notifications } from "@shared/schema";
import { type User, type InsertUser, type Habit, type InsertHabit, 
         type Routine, type InsertRoutine, type HabitLog, 
         type InsertHabitLog, type Notification, type InsertNotification } from "@shared/schema";
import { db } from "./db";
import { eq, and, gte, lte } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByPhone(phone: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<User>): Promise<User | undefined>;
  
  // Habit methods
  getHabit(id: number): Promise<Habit | undefined>;
  getHabitsByUser(userId: number): Promise<Habit[]>;
  getHabitsByRoutine(routineId: number): Promise<Habit[]>;
  createHabit(habit: InsertHabit): Promise<Habit>;
  updateHabit(id: number, habit: Partial<Habit>): Promise<Habit | undefined>;
  deleteHabit(id: number): Promise<boolean>;
  
  // Routine methods
  getRoutine(id: number): Promise<Routine | undefined>;
  getRoutinesByUser(userId: number): Promise<Routine[]>;
  createRoutine(routine: InsertRoutine): Promise<Routine>;
  updateRoutine(id: number, routine: Partial<Routine>): Promise<Routine | undefined>;
  deleteRoutine(id: number): Promise<boolean>;
  
  // HabitLog methods
  getHabitLog(id: number): Promise<HabitLog | undefined>;
  getHabitLogsByUser(userId: number): Promise<HabitLog[]>;
  getHabitLogsByHabit(habitId: number): Promise<HabitLog[]>;
  getHabitLogsForDate(userId: number, date: Date): Promise<HabitLog[]>;
  createHabitLog(log: InsertHabitLog): Promise<HabitLog>;
  updateHabitLog(id: number, log: Partial<HabitLog>): Promise<HabitLog | undefined>;
  
  // Notification methods
  getNotification(id: number): Promise<Notification | undefined>;
  getNotificationsByUser(userId: number): Promise<Notification[]>;
  getPendingNotifications(): Promise<Notification[]>;
  createNotification(notification: InsertNotification): Promise<Notification>;
  updateNotification(id: number, notification: Partial<Notification>): Promise<Notification | undefined>;
  deleteNotification(id: number): Promise<boolean>;
}

// Database storage implementation
export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async getUserByPhone(phone: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.phone, phone));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async updateUser(id: number, userData: Partial<User>): Promise<User | undefined> {
    const [user] = await db
      .update(users)
      .set(userData)
      .where(eq(users.id, id))
      .returning();
    return user || undefined;
  }

  // Habit methods
  async getHabit(id: number): Promise<Habit | undefined> {
    const [habit] = await db.select().from(habits).where(eq(habits.id, id));
    return habit || undefined;
  }

  async getHabitsByUser(userId: number): Promise<Habit[]> {
    return db.select().from(habits).where(eq(habits.userId, userId));
  }

  async getHabitsByRoutine(routineId: number): Promise<Habit[]> {
    return db.select().from(habits).where(eq(habits.routineId, routineId));
  }

  async createHabit(insertHabit: InsertHabit): Promise<Habit> {
    const [habit] = await db.insert(habits).values(insertHabit).returning();
    return habit;
  }

  async updateHabit(id: number, habitData: Partial<Habit>): Promise<Habit | undefined> {
    const [habit] = await db
      .update(habits)
      .set(habitData)
      .where(eq(habits.id, id))
      .returning();
    return habit || undefined;
  }

  async deleteHabit(id: number): Promise<boolean> {
    const result = await db.delete(habits).where(eq(habits.id, id));
    return result.rowCount !== null && result.rowCount > 0;
  }

  // Routine methods
  async getRoutine(id: number): Promise<Routine | undefined> {
    const [routine] = await db.select().from(routines).where(eq(routines.id, id));
    return routine || undefined;
  }

  async getRoutinesByUser(userId: number): Promise<Routine[]> {
    return db.select().from(routines).where(eq(routines.userId, userId));
  }

  async createRoutine(insertRoutine: InsertRoutine): Promise<Routine> {
    const [routine] = await db.insert(routines).values(insertRoutine).returning();
    return routine;
  }

  async updateRoutine(id: number, routineData: Partial<Routine>): Promise<Routine | undefined> {
    const [routine] = await db
      .update(routines)
      .set(routineData)
      .where(eq(routines.id, id))
      .returning();
    return routine || undefined;
  }

  async deleteRoutine(id: number): Promise<boolean> {
    const result = await db.delete(routines).where(eq(routines.id, id));
    return result.rowCount !== null && result.rowCount > 0;
  }

  // HabitLog methods
  async getHabitLog(id: number): Promise<HabitLog | undefined> {
    const [log] = await db.select().from(habitLogs).where(eq(habitLogs.id, id));
    return log || undefined;
  }

  async getHabitLogsByUser(userId: number): Promise<HabitLog[]> {
    const result = await db
      .select({
        id: habitLogs.id,
        habitId: habitLogs.habitId,
        userId: habitLogs.userId,
        date: habitLogs.date,
        completed: habitLogs.completed
      })
      .from(habitLogs)
      .innerJoin(habits, eq(habitLogs.habitId, habits.id))
      .where(eq(habits.userId, userId));
    
    return result;
  }

  async getHabitLogsByHabit(habitId: number): Promise<HabitLog[]> {
    return db.select().from(habitLogs).where(eq(habitLogs.habitId, habitId));
  }

  async getHabitLogsForDate(userId: number, date: Date): Promise<HabitLog[]> {
    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);
    
    const endDate = new Date(date);
    endDate.setHours(23, 59, 59, 999);
    
    const result = await db
      .select({
        id: habitLogs.id,
        habitId: habitLogs.habitId,
        userId: habitLogs.userId,
        date: habitLogs.date,
        completed: habitLogs.completed
      })
      .from(habitLogs)
      .innerJoin(habits, eq(habitLogs.habitId, habits.id))
      .where(
        and(
          eq(habits.userId, userId),
          gte(habitLogs.date, startDate),
          lte(habitLogs.date, endDate)
        )
      );
    
    return result;
  }

  async createHabitLog(insertLog: InsertHabitLog): Promise<HabitLog> {
    const [log] = await db.insert(habitLogs).values(insertLog).returning();
    return log;
  }

  async updateHabitLog(id: number, logData: Partial<HabitLog>): Promise<HabitLog | undefined> {
    const [log] = await db
      .update(habitLogs)
      .set(logData)
      .where(eq(habitLogs.id, id))
      .returning();
    return log || undefined;
  }

  // Notification methods
  async getNotification(id: number): Promise<Notification | undefined> {
    const [notification] = await db.select().from(notifications).where(eq(notifications.id, id));
    return notification || undefined;
  }

  async getNotificationsByUser(userId: number): Promise<Notification[]> {
    return db.select().from(notifications).where(eq(notifications.userId, userId));
  }

  async getPendingNotifications(): Promise<Notification[]> {
    const now = new Date();
    return db
      .select()
      .from(notifications)
      .where(
        and(
          eq(notifications.sent, false),
          lte(notifications.scheduledTime, now)
        )
      );
  }

  async createNotification(insertNotification: InsertNotification): Promise<Notification> {
    const [notification] = await db.insert(notifications).values(insertNotification).returning();
    return notification;
  }

  async updateNotification(id: number, notificationData: Partial<Notification>): Promise<Notification | undefined> {
    const [notification] = await db
      .update(notifications)
      .set(notificationData)
      .where(eq(notifications.id, id))
      .returning();
    return notification || undefined;
  }

  async deleteNotification(id: number): Promise<boolean> {
    const result = await db.delete(notifications).where(eq(notifications.id, id));
    return result.rowCount !== null && result.rowCount > 0;
  }
}

// Export an instance of the storage
export const storage = new DatabaseStorage();