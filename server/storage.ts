import { 
  users, type User, type InsertUser,
  habits, type Habit, type InsertHabit,
  routines, type Routine, type InsertRoutine,
  habitLogs, type HabitLog, type InsertHabitLog,
  notifications, type Notification, type InsertNotification
} from "@shared/schema";

// Comprehensive storage interface
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

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private habits: Map<number, Habit>;
  private routines: Map<number, Routine>;
  private habitLogs: Map<number, HabitLog>;
  private notifications: Map<number, Notification>;
  
  private userId: number;
  private habitId: number;
  private routineId: number;
  private habitLogId: number;
  private notificationId: number;

  constructor() {
    this.users = new Map();
    this.habits = new Map();
    this.routines = new Map();
    this.habitLogs = new Map();
    this.notifications = new Map();
    
    this.userId = 1;
    this.habitId = 1;
    this.routineId = 1;
    this.habitLogId = 1;
    this.notificationId = 1;
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email,
    );
  }

  async getUserByPhone(phone: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.phone === phone,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: number, userData: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...userData };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Habit methods
  async getHabit(id: number): Promise<Habit | undefined> {
    return this.habits.get(id);
  }

  async getHabitsByUser(userId: number): Promise<Habit[]> {
    return Array.from(this.habits.values()).filter(
      (habit) => habit.userId === userId,
    );
  }

  async getHabitsByRoutine(routineId: number): Promise<Habit[]> {
    return Array.from(this.habits.values()).filter(
      (habit) => habit.routineId === routineId,
    );
  }

  async createHabit(insertHabit: InsertHabit): Promise<Habit> {
    const id = this.habitId++;
    const habit: Habit = { ...insertHabit, id };
    this.habits.set(id, habit);
    return habit;
  }

  async updateHabit(id: number, habitData: Partial<Habit>): Promise<Habit | undefined> {
    const habit = this.habits.get(id);
    if (!habit) return undefined;
    
    const updatedHabit = { ...habit, ...habitData };
    this.habits.set(id, updatedHabit);
    return updatedHabit;
  }

  async deleteHabit(id: number): Promise<boolean> {
    return this.habits.delete(id);
  }

  // Routine methods
  async getRoutine(id: number): Promise<Routine | undefined> {
    return this.routines.get(id);
  }

  async getRoutinesByUser(userId: number): Promise<Routine[]> {
    return Array.from(this.routines.values()).filter(
      (routine) => routine.userId === userId,
    );
  }

  async createRoutine(insertRoutine: InsertRoutine): Promise<Routine> {
    const id = this.routineId++;
    const routine: Routine = { ...insertRoutine, id };
    this.routines.set(id, routine);
    return routine;
  }

  async updateRoutine(id: number, routineData: Partial<Routine>): Promise<Routine | undefined> {
    const routine = this.routines.get(id);
    if (!routine) return undefined;
    
    const updatedRoutine = { ...routine, ...routineData };
    this.routines.set(id, updatedRoutine);
    return updatedRoutine;
  }

  async deleteRoutine(id: number): Promise<boolean> {
    return this.routines.delete(id);
  }

  // HabitLog methods
  async getHabitLog(id: number): Promise<HabitLog | undefined> {
    return this.habitLogs.get(id);
  }

  async getHabitLogsByUser(userId: number): Promise<HabitLog[]> {
    return Array.from(this.habitLogs.values()).filter(
      (log) => log.userId === userId,
    );
  }

  async getHabitLogsByHabit(habitId: number): Promise<HabitLog[]> {
    return Array.from(this.habitLogs.values()).filter(
      (log) => log.habitId === habitId,
    );
  }

  async getHabitLogsForDate(userId: number, date: Date): Promise<HabitLog[]> {
    const dateStart = new Date(date);
    dateStart.setHours(0, 0, 0, 0);
    
    const dateEnd = new Date(date);
    dateEnd.setHours(23, 59, 59, 999);
    
    return Array.from(this.habitLogs.values()).filter(
      (log) => log.userId === userId && 
                new Date(log.date) >= dateStart && 
                new Date(log.date) <= dateEnd
    );
  }

  async createHabitLog(insertLog: InsertHabitLog): Promise<HabitLog> {
    const id = this.habitLogId++;
    const log: HabitLog = { ...insertLog, id };
    this.habitLogs.set(id, log);
    return log;
  }

  async updateHabitLog(id: number, logData: Partial<HabitLog>): Promise<HabitLog | undefined> {
    const log = this.habitLogs.get(id);
    if (!log) return undefined;
    
    const updatedLog = { ...log, ...logData };
    this.habitLogs.set(id, updatedLog);
    return updatedLog;
  }

  // Notification methods
  async getNotification(id: number): Promise<Notification | undefined> {
    return this.notifications.get(id);
  }

  async getNotificationsByUser(userId: number): Promise<Notification[]> {
    return Array.from(this.notifications.values()).filter(
      (notification) => notification.userId === userId,
    );
  }

  async getPendingNotifications(): Promise<Notification[]> {
    return Array.from(this.notifications.values()).filter(
      (notification) => !notification.sent && new Date(notification.scheduledTime) <= new Date()
    );
  }

  async createNotification(insertNotification: InsertNotification): Promise<Notification> {
    const id = this.notificationId++;
    const notification: Notification = { ...insertNotification, id };
    this.notifications.set(id, notification);
    return notification;
  }

  async updateNotification(id: number, notificationData: Partial<Notification>): Promise<Notification | undefined> {
    const notification = this.notifications.get(id);
    if (!notification) return undefined;
    
    const updatedNotification = { ...notification, ...notificationData };
    this.notifications.set(id, updatedNotification);
    return updatedNotification;
  }

  async deleteNotification(id: number): Promise<boolean> {
    return this.notifications.delete(id);
  }
}

export const storage = new MemStorage();
