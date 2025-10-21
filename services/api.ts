import type { User, AnalysisRecord, Signal } from '../types';

// --- Hardcoded Admin User ---
const adminUser: User = { 
  id: '1', 
  name: 'admin', 
  email: 'admin@goldvision.com', 
  password: 'Kiminato@855', 
  key: 'admin_key_super_secret', 
  status: 'VIP', 
  analysisCount: 0, 
  lastAnalysisTimestamp: new Date(0).toISOString() 
};

// --- In-memory "Database" ---
// In a real app, this would be a database.
let mockUsers: User[] = [adminUser];

// Analyses are now stored in memory and can be added by users.
let mockAnalyses: AnalysisRecord[] = [];

// --- END MOCK DATABASE ---

// Simulate network delay
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

/**
 * The API service layer.
 * In a real application, these functions would use `fetch` to make HTTP requests
 * to a secure backend server, which would then interact with the MongoDB database.
 */
export const api = {
  /**
   * Simulates a user login request.
   * @param username - The user's username.
   * @param password - The user's password.
   * @returns The user object if credentials are valid, otherwise null.
   */
  login: async (username: string, password: string): Promise<User | null> => {
    await delay(500); // Simulate network latency
    const user = mockUsers.find(u => u.name.toLowerCase() === username.toLowerCase() && u.password === password);
    if (user) {
      // Never send the password back to the client
      const { password: _, ...userToReturn } = user;
      return userToReturn;
    }
    return null;
  },
  
  /**
   * Simulates a new user registration.
   * @param username - The desired username.
   * @param email - The user's email.
   * @param password - The user's password.
   * @returns The newly created user object, or null if the user already exists.
   */
  register: async (username: string, email: string, password: string): Promise<User | null> => {
    await delay(500);
    if (mockUsers.some(u => u.name.toLowerCase() === username.toLowerCase() || u.email.toLowerCase() === email.toLowerCase())) {
      return null; // User already exists
    }
    const newUser: User = {
      id: `${mockUsers.length + 1}`,
      name: username,
      email: email,
      password: password,
      key: `key_${Math.random().toString(36).substr(2, 9)}`,
      status: 'Free',
      analysisCount: 0,
      lastAnalysisTimestamp: new Date(0).toISOString(),
    };
    mockUsers.push(newUser);
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
    const user = mockUsers.find(u => u.id === userId);
    if (!user) {
      throw new Error("User not found.");
    }

    if (user.name === 'admin') {
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
      const userToUpdate = mockUsers.find(u => u.id === userId);
      if (userToUpdate) userToUpdate.analysisCount = 0;
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
   * Simulates fetching all users for the admin dashboard.
   */
  getAllUsers: async (): Promise<User[]> => {
    await delay(300);
    return mockUsers.map(u => {
      const { password, ...user } = u;
      return user;
    });
  },

  /**
   * Simulates fetching all analysis records for the admin dashboard.
   */
  getAllAnalyses: async (): Promise<AnalysisRecord[]> => {
    await delay(300);
    return [...mockAnalyses]; // Return a copy
  },
  
  /**
   * Simulates fetching analysis records for a specific, authenticated user.
   */
  getAnalysesForUser: async (userId: string): Promise<AnalysisRecord[]> => {
    await delay(300);
    return mockAnalyses.filter(a => a.userId === userId);
  },

  /**
   * Simulates a user adding a new analysis record.
   */
  addAnalysis: async (userId: string, signalData: Signal): Promise<AnalysisRecord> => {
    await delay(200);

    const userIndex = mockUsers.findIndex(u => u.id === userId);
    if (userIndex === -1) throw new Error("User not found");

    // Update user's analysis stats
    const user = mockUsers[userIndex];
    user.analysisCount += 1;
    user.lastAnalysisTimestamp = new Date().toISOString();
    mockUsers[userIndex] = user;

    const newAnalysis: AnalysisRecord = {
      ...signalData,
      id: `anl_${Date.now()}`, 
      userId: userId,
      timestamp: new Date().toUTCString(),
    };
    mockAnalyses.push(newAnalysis);
    
    return newAnalysis;
  },

  /**
   * Simulates updating a user's properties.
   */
  updateUser: async (userId: string, updates: Partial<User>): Promise<User | undefined> => {
    await delay(200);
    const userIndex = mockUsers.findIndex(u => u.id === userId);
    if (userIndex === -1) return undefined;

    const currentUser = mockUsers[userIndex];
    const updatedUser = { ...currentUser, ...updates };

    if (currentUser.name.toLowerCase() === 'admin') {
      updatedUser.status = 'VIP';
    }

    mockUsers[userIndex] = updatedUser;
    
    if (updatedUser.id === adminUser.id) {
        Object.assign(adminUser, updatedUser);
    }

    if (updatedUser) {
        const { password, ...userToReturn } = updatedUser;
        return userToReturn;
    }
    return undefined;
  },

  /**
   * Simulates an admin updating an AI analysis record.
   */
  updateAnalysis: async (analysisId: string, updates: Partial<AnalysisRecord>): Promise<AnalysisRecord | undefined> => {
    await delay(200);

    let updatedAnalysis: AnalysisRecord | undefined;
    mockAnalyses = mockAnalyses.map(analysis => {
      if (analysis.id === analysisId) {
        updatedAnalysis = { ...analysis, ...updates };
        return updatedAnalysis;
      }
      return analysis;
    });
    return updatedAnalysis;
  }
};