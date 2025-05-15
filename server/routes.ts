import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertUserSchema, 
  insertHabitSchema, 
  insertRoutineSchema, 
  insertHabitLogSchema, 
  insertNotificationSchema 
} from "@shared/schema";
import session from "express-session";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import MemoryStore from "memorystore";
import bcrypt from "bcryptjs";

// Create a memory store backed by express-session
const SessionStore = MemoryStore(session);

// Utility for validating requests
const validateRequest = (schema: any) => (req: Request, res: Response, next: any) => {
  try {
    schema.parse(req.body);
    next();
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
};

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);

  // Configure session middleware
  app.use(
    session({
      secret: process.env.SESSION_SECRET || "pacepal-session-secret",
      resave: false,
      saveUninitialized: false,
      cookie: { 
        secure: process.env.NODE_ENV === "production",
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
      },
      store: new SessionStore({
        checkPeriod: 86400000 // Clear expired entries every 24h
      })
    })
  );

  // Initialize Passport and restore authentication state from session
  app.use(passport.initialize());
  app.use(passport.session());

  // Configure passport local strategy
  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const user = await storage.getUserByUsername(username);
        if (!user) {
          return done(null, false, { message: "Incorrect username or password" });
        }

        // Compare password with bcrypt
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          return done(null, false, { message: "Incorrect username or password" });
        }

        return done(null, user);
      } catch (err) {
        return done(err);
      }
    })
  );

  // Serialize and deserialize user
  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (err) {
      done(err);
    }
  });

  // Authentication middleware
  const ensureAuthenticated = (req: Request, res: Response, next: any) => {
    if (req.isAuthenticated()) {
      return next();
    }
    res.status(401).json({ message: "Unauthorized" });
  };

  /**
   * Authentication Routes
   */
  app.post("/api/auth/login", passport.authenticate("local"), (req, res) => {
    const userResponse = {
      ...req.user,
      password: undefined
    };
    res.status(200).json({ user: userResponse });
  });

  app.post("/api/auth/register", validateRequest(insertUserSchema), async (req, res) => {
    try {
      // Check if user with email or phone already exists
      const existingEmailUser = await storage.getUserByEmail(req.body.email);
      if (existingEmailUser) {
        return res.status(400).json({ message: "Email already in use" });
      }

      const existingPhoneUser = await storage.getUserByPhone(req.body.phone);
      if (existingPhoneUser) {
        return res.status(400).json({ message: "Phone number already in use" });
      }

      // Hash the password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(req.body.password, salt);

      // Create new user with hashed password
      const userData = {
        ...req.body,
        password: hashedPassword
      };
      
      const user = await storage.createUser(userData);
      
      // Create a sanitized version without password for the client
      const userResponse = {
        ...user,
        password: undefined
      };
      
      // Automatically log in the new user
      req.login(user, (err) => {
        if (err) {
          return res.status(500).json({ message: "Error during login after registration" });
        }
        return res.status(201).json({ user: userResponse });
      });
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    req.logout((err) => {
      if (err) {
        return res.status(500).json({ message: "Error during logout" });
      }
      res.status(200).json({ message: "Logged out successfully" });
    });
  });

  app.get("/api/auth/me", ensureAuthenticated, (req, res) => {
    const userResponse = {
      ...req.user,
      password: undefined
    };
    res.json({ user: userResponse });
  });

  /**
   * Habit Routes
   */
  app.get("/api/habits", ensureAuthenticated, async (req, res) => {
    try {
      const userId = (req.user as any).id;
      const habits = await storage.getHabitsByUser(userId);
      res.json(habits);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/habits/:id", ensureAuthenticated, async (req, res) => {
    try {
      const habit = await storage.getHabit(parseInt(req.params.id));
      if (!habit) {
        return res.status(404).json({ message: "Habit not found" });
      }
      
      // Ensure user can only access their own habits
      if (habit.userId !== (req.user as any).id) {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      res.json(habit);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/habits", ensureAuthenticated, validateRequest(insertHabitSchema), async (req, res) => {
    try {
      // Ensure user can only create habits for themselves
      if (req.body.userId !== (req.user as any).id) {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      const habit = await storage.createHabit(req.body);
      res.status(201).json(habit);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.put("/api/habits/:id", ensureAuthenticated, async (req, res) => {
    try {
      const habitId = parseInt(req.params.id);
      const habit = await storage.getHabit(habitId);
      
      if (!habit) {
        return res.status(404).json({ message: "Habit not found" });
      }
      
      // Ensure user can only update their own habits
      if (habit.userId !== (req.user as any).id) {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      const updatedHabit = await storage.updateHabit(habitId, req.body);
      res.json(updatedHabit);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.delete("/api/habits/:id", ensureAuthenticated, async (req, res) => {
    try {
      const habitId = parseInt(req.params.id);
      const habit = await storage.getHabit(habitId);
      
      if (!habit) {
        return res.status(404).json({ message: "Habit not found" });
      }
      
      // Ensure user can only delete their own habits
      if (habit.userId !== (req.user as any).id) {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      await storage.deleteHabit(habitId);
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  /**
   * Routine Routes
   */
  app.get("/api/routines", ensureAuthenticated, async (req, res) => {
    try {
      const userId = (req.user as any).id;
      const routines = await storage.getRoutinesByUser(userId);
      res.json(routines);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/routines/:id", ensureAuthenticated, async (req, res) => {
    try {
      const routine = await storage.getRoutine(parseInt(req.params.id));
      if (!routine) {
        return res.status(404).json({ message: "Routine not found" });
      }
      
      // Ensure user can only access their own routines
      if (routine.userId !== (req.user as any).id) {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      res.json(routine);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/routines", ensureAuthenticated, validateRequest(insertRoutineSchema), async (req, res) => {
    try {
      // Ensure user can only create routines for themselves
      if (req.body.userId !== (req.user as any).id) {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      const routine = await storage.createRoutine(req.body);
      res.status(201).json(routine);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.put("/api/routines/:id", ensureAuthenticated, async (req, res) => {
    try {
      const routineId = parseInt(req.params.id);
      const routine = await storage.getRoutine(routineId);
      
      if (!routine) {
        return res.status(404).json({ message: "Routine not found" });
      }
      
      // Ensure user can only update their own routines
      if (routine.userId !== (req.user as any).id) {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      const updatedRoutine = await storage.updateRoutine(routineId, req.body);
      res.json(updatedRoutine);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.delete("/api/routines/:id", ensureAuthenticated, async (req, res) => {
    try {
      const routineId = parseInt(req.params.id);
      const routine = await storage.getRoutine(routineId);
      
      if (!routine) {
        return res.status(404).json({ message: "Routine not found" });
      }
      
      // Ensure user can only delete their own routines
      if (routine.userId !== (req.user as any).id) {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      await storage.deleteRoutine(routineId);
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  /**
   * Habit Log Routes
   */
  app.get("/api/habit-logs", ensureAuthenticated, async (req, res) => {
    try {
      const userId = (req.user as any).id;
      const habitLogs = await storage.getHabitLogsByUser(userId);
      res.json(habitLogs);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/habit-logs", ensureAuthenticated, validateRequest(insertHabitLogSchema), async (req, res) => {
    try {
      // Ensure user can only create logs for themselves
      if (req.body.userId !== (req.user as any).id) {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      const habitLog = await storage.createHabitLog(req.body);
      res.status(201).json(habitLog);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.put("/api/habit-logs/:id", ensureAuthenticated, async (req, res) => {
    try {
      const logId = parseInt(req.params.id);
      const log = await storage.getHabitLog(logId);
      
      if (!log) {
        return res.status(404).json({ message: "Habit log not found" });
      }
      
      // Ensure user can only update their own logs
      if (log.userId !== (req.user as any).id) {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      const updatedLog = await storage.updateHabitLog(logId, req.body);
      res.json(updatedLog);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  /**
   * Notification Routes
   */
  app.get("/api/notifications", ensureAuthenticated, async (req, res) => {
    try {
      const userId = (req.user as any).id;
      const notifications = await storage.getNotificationsByUser(userId);
      res.json(notifications);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/notifications", ensureAuthenticated, validateRequest(insertNotificationSchema), async (req, res) => {
    try {
      // Ensure user can only create notifications for themselves
      if (req.body.userId !== (req.user as any).id) {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      const notification = await storage.createNotification(req.body);
      res.status(201).json(notification);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.put("/api/notifications/:id", ensureAuthenticated, async (req, res) => {
    try {
      const notificationId = parseInt(req.params.id);
      const notification = await storage.getNotification(notificationId);
      
      if (!notification) {
        return res.status(404).json({ message: "Notification not found" });
      }
      
      // Ensure user can only update their own notifications
      if (notification.userId !== (req.user as any).id) {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      const updatedNotification = await storage.updateNotification(notificationId, req.body);
      res.json(updatedNotification);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.delete("/api/notifications/:id", ensureAuthenticated, async (req, res) => {
    try {
      const notificationId = parseInt(req.params.id);
      const notification = await storage.getNotification(notificationId);
      
      if (!notification) {
        return res.status(404).json({ message: "Notification not found" });
      }
      
      // Ensure user can only delete their own notifications
      if (notification.userId !== (req.user as any).id) {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      await storage.deleteNotification(notificationId);
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  /**
   * SMS Notification System
   * This would be implemented with a real SMS provider in production
   * For the MVP, we'll simulate it
   */
  app.post("/api/sms/test", ensureAuthenticated, async (req, res) => {
    const { phone, message } = req.body;
    
    if (!phone || !message) {
      return res.status(400).json({ message: "Phone number and message are required" });
    }
    
    // In a real implementation, this would send an actual SMS
    console.log(`[SMS Notification] To: ${phone}, Message: ${message}`);
    
    res.status(200).json({ message: "SMS sent successfully (simulated)" });
  });

  return httpServer;
}
