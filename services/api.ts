import type { User, AnalysisRecord, Signal } from '../types';

/**
 * --- DATABASE SIMULATION ---
 * This file simulates a backend API using localStorage for data persistence.
 * In a real-world production application deployed on Vercel, this would be replaced with
 * API endpoints (e.g., Vercel Serverless Functions) that connect to a persistent database
 * like Vercel Postgres, MongoDB Atlas, or Supabase.
 * localStorage is used here to provide a more realistic user experience by persisting
 * data across page reloads in the browser.
 */

const USERS_KEY = 'goldsignal_users';
const ANALYSES_KEY = 'goldsignal_analyses';

// --- Hardcoded Admin User for initial setup ---
const adminUser: User = { 
  id: '1', 
  name: 'admin', 
  email: 'admin@goldvision.com', 
  password: 'Kiminato@855', // In a real app, passwords must be hashed server-side.
  key: 'admin_key_super_secret', 
  status: 'VIP', 
  analysisCount: 0, 
  lastAnalysisTimestamp: new Date(0).toISOString() 
};

// --- LocalStorage Helper Functions ---

const getUsersFromStorage = (): User[] => {
    try {
        const storedUsers = localStorage.getItem(USERS_KEY);
        if (storedUsers) {
            return JSON.parse(storedUsers);
        }
    } catch (error) {
        console.error("Error reading users from localStorage", error);
    }
    // If storage is empty or corrupted, initialize with the admin user.
    const initialUsers = [adminUser];
    localStorage.setItem(USERS_KEY, JSON.stringify(initialUsers));
    return initialUsers;
};

const saveUsersToStorage = (users: User[]) => {
    try {
        localStorage.setItem(USERS_KEY, JSON.stringify(users));
    } catch (error) {
        console.error("Error saving users to localStorage", error);
    }
};

const getAnalysesFromStorage = (): AnalysisRecord[] => {
    try {
        const storedAnalyses = localStorage.getItem(ANALYSES_KEY);
        if (storedAnalyses) {
            return JSON.parse(storedAnalyses);
        }
    } catch (error) {
        console.error("Error reading analyses from localStorage", error);
    }
    // If storage is empty or corrupted, initialize with an empty array.
    localStorage.setItem(ANALYSES_KEY, JSON.stringify([]));
    return [];
};

const saveAnalysesToStorage = (analyses: AnalysisRecord[]) => {
    try {
        localStorage.setItem(ANALYSES_KEY, JSON.stringify(analyses));
    } catch (error) {
        console.error("Error saving analyses to localStorage", error);
    }
};


// Simulate network delay
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

/**
 * The API service layer.
 */
export const api = {
  /**
   * Simulates a user login request.
   */
  login: async (username: string, password: string): Promise<User | null> => {
    await delay(500);
    const users = getUsersFromStorage();
    const user = users.find(u => u.name.toLowerCase() === username.toLowerCase() && u.password === password);
    if (user) {
      // Never send the password back to the client
      const { password: _, ...userToReturn } = user;
      return userToReturn;
    }
    return null;
  },
  
  /**
   * Simulates a new user registration.
   */
  register: async (username: string, email: string, password: string): Promise<User | null> => {
    await delay(500);
    const users = getUsersFromStorage();
    if (users.some(u => u.name.toLowerCase() === username.toLowerCase() || u.email.toLowerCase() === email.toLowerCase())) {
      return null; // User already exists
    }
    const newUser: User = {
      id: `${users.length > 0 ? Math.max(...users.map(u => parseInt(u.id, 10))) + 1 : 1}`,
      name: username,
      email: email,
      password: password,
      key: `key_${Math.random().toString(36).substr(2, 9)}`,
      status: 'Free',
      analysisCount: 0,
      lastAnalysisTimestamp: new Date(0).toISOString(),
    };
    users.push(newUser);
    saveUsersToStorage(users);
    const { password: _, ...userToReturn } = newUser;
    return userToReturn;
  },

  /**
   * Checks if a user can perform an analysis based on their plan and cooldown.
   */
  canUserAnalyze: async (userId: string): Promise<{
    canAnalyze: boolean;
    reason: 'cooldown' | 'limit' | null;
    timeLeft: number | null; // Milliseconds
    dailyCount: number;
    dailyLimit: number;
  }> => {
    await delay(100);
    const users = getUsersFromStorage();
    const user = users.find(u => u.id === userId);
    if (!user) {
      throw new Error("User not found.");
    }

    if (user.name.toLowerCase() === 'admin') {
      return { canAnalyze: true, reason: null, timeLeft: null, dailyCount: user.analysisCount, dailyLimit: 999 };
    }

    const dailyLimit = user.status === 'VIP' ? 5 : 1;
    const cooldownPeriod = 60 * 60 * 1000; // 1 hour in ms

    const now = new Date();
    const lastAnalysisDate = new Date(user.lastAnalysisTimestamp);

    // Reset daily count if the last analysis was on a previous day (UTC)
    if (lastAnalysisDate.getUTCFullYear() < now.getUTCFullYear() ||
        lastAnalysisDate.getUTCMonth() < now.getUTCMonth() ||
        lastAnalysisDate.getUTCDate() < now.getUTCDate()) 
    {
      const userIndex = users.findIndex(u => u.id === userId);
      if (userIndex !== -1) {
        users[userIndex].analysisCount = 0;
        saveUsersToStorage(users);
        // We need to update our local user object for the checks below
        user.analysisCount = 0;
      }
    }
    
    // Check daily limit
    if (user.analysisCount >= dailyLimit) {
      return { canAnalyze: false, reason: 'limit', timeLeft: null, dailyCount: user.analysisCount, dailyLimit };
    }

    // Check cooldown
    const timeSinceLast = now.getTime() - lastAnalysisDate.getTime();
    if (timeSinceLast < cooldownPeriod) {
        const timeLeft = cooldownPeriod - timeSinceLast;
        return { canAnalyze: false, reason: 'cooldown', timeLeft, dailyCount: user.analysisCount, dailyLimit };
    }

    return { canAnalyze: true, reason: null, timeLeft: null, dailyCount: user.analysisCount, dailyLimit };
  },

  /**
   * Fetches all users for the admin dashboard.
   */
  getAllUsers: async (): Promise<User[]> => {
    await delay(300);
    const users = getUsersFromStorage();
    return users.map(u => {
      const { password, ...user } = u;
      return user;
    });
  },

  /**
   * Fetches all analysis records for the admin dashboard.
   */
  getAllAnalyses: async (): Promise<AnalysisRecord[]> => {
    await delay(300);
    return getAnalysesFromStorage();
  },
  
  /**
   * Fetches analysis records for a specific user.
   */
  getAnalysesForUser: async (userId: string): Promise<AnalysisRecord[]> => {
    await delay(300);
    const analyses = getAnalysesFromStorage();
    return analyses.filter(a => a.userId === userId);
  },

  /**
   * Adds a new analysis record for a user.
   */
  addAnalysis: async (userId: string, signalData: Signal): Promise<AnalysisRecord> => {
    await delay(200);

    const users = getUsersFromStorage();
    const analyses = getAnalysesFromStorage();
    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex === -1) throw new Error("User not found");

    // Update user's analysis stats
    users[userIndex].analysisCount += 1;
    users[userIndex].lastAnalysisTimestamp = new Date().toISOString();
    saveUsersToStorage(users);

    const newAnalysis: AnalysisRecord = {
      ...signalData,
      id: `anl_${Date.now()}`, 
      userId: userId,
      timestamp: new Date().toUTCString(),
    };
    analyses.push(newAnalysis);
    saveAnalysesToStorage(analyses);
    
    return newAnalysis;
  },

  /**
   * Updates a user's properties.
   */
  updateUser: async (userId: string, updates: Partial<User>): Promise<User | undefined> => {
    await delay(200);
    const users = getUsersFromStorage();
    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex === -1) return undefined;

    const currentUser = users[userIndex];
    // Preserve the original password if a new one isn't provided in the update payload.
    const updatedUser = { ...currentUser, ...updates };
    if (!updates.password) {
        updatedUser.password = currentUser.password;
    }

    // Admin user cannot be demoted from VIP status.
    if (currentUser.name.toLowerCase() === 'admin') {
      updatedUser.status = 'VIP';
    }

    users[userIndex] = updatedUser;
    saveUsersToStorage(users);

    const { password, ...userToReturn } = updatedUser;
    return userToReturn;
  },

  /**
   * Updates an AI analysis record.
   */
  updateAnalysis: async (analysisId: string, updates: Partial<AnalysisRecord>): Promise<AnalysisRecord | undefined> => {
    await delay(200);
    const analyses = getAnalysesFromStorage();
    let updatedAnalysis: AnalysisRecord | undefined;
    const newAnalyses = analyses.map(analysis => {
      if (analysis.id === analysisId) {
        updatedAnalysis = { ...analysis, ...updates };
        return updatedAnalysis;
      }
      return analysis;
    });
    saveAnalysesToStorage(newAnalyses);
    return updatedAnalysis;
  }
};