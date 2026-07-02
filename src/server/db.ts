import fs from "fs";
import path from "path";
import crypto from "crypto";

const DB_FILE = path.join(process.cwd(), "users-db.json");

export interface ServerUser {
  username: string;
  email: string;
  passwordHash: string;
  salt: string;
  balanceCoins: number;
  balanceCash: number;
  lastSpinTime: string | null;
  spinHistory: ServerSpinResult[];
  lastDailyLoginTime: string | null;
  freeSpinsLeft: number;
}

export interface ServerSpinResult {
  id: string;
  timestamp: string;
  prizeLabel: string;
  prizeType: "bomb" | "zonk" | "coins" | "cash";
  prizeValue: number;
  prizeIcon: string;
}

// In-memory cache synced to disk
let usersCache: Record<string, ServerUser> = {};

// Load database from disk
function loadDb() {
  try {
    if (fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, "utf8");
      usersCache = JSON.parse(data);
    } else {
      usersCache = {};
      saveDb();
    }
  } catch (err) {
    console.error("Failed to load user database:", err);
    usersCache = {};
  }
}

// Save database to disk
function saveDb() {
  try {
    const dir = path.dirname(DB_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(usersCache, null, 2), "utf8");
  } catch (err) {
    console.error("Failed to save user database:", err);
  }
}

// Initialize database on load
loadDb();

export function hashPassword(password: string, salt: string): string {
  return crypto.pbkdf2Sync(password, salt, 1000, 64, "sha512").toString("hex");
}

export function generateSalt(): string {
  return crypto.randomBytes(16).toString("hex");
}

export function getUserByEmail(email: string): ServerUser | null {
  const normEmail = email.trim().toLowerCase();
  for (const user of Object.values(usersCache)) {
    if (user.email.toLowerCase() === normEmail) {
      return user;
    }
  }
  return null;
}

export function getUserByUsername(username: string): ServerUser | null {
  const normUsername = username.trim().toLowerCase();
  for (const user of Object.values(usersCache)) {
    if (user.username.toLowerCase() === normUsername) {
      return user;
    }
  }
  return null;
}

export function createUser(username: string, email: string, passwordPlain: string): ServerUser {
  const salt = generateSalt();
  const passwordHash = hashPassword(passwordPlain, salt);

  const newUser: ServerUser = {
    username: username.trim(),
    email: email.trim().toLowerCase(),
    passwordHash,
    salt,
    balanceCoins: 100, // Welcome bonus coins!
    balanceCash: 0,
    lastSpinTime: null,
    spinHistory: [],
    lastDailyLoginTime: null,
    freeSpinsLeft: 10, // 10 free spins for new users!
  };

  usersCache[newUser.username.toLowerCase()] = newUser;
  saveDb();
  return newUser;
}

export function updateUser(username: string, updates: Partial<Omit<ServerUser, "username" | "salt" | "passwordHash">> & { passwordPlain?: string }): ServerUser | null {
  const key = username.trim().toLowerCase();
  const user = usersCache[key];
  if (!user) return null;

  if (updates.passwordPlain) {
    const newSalt = generateSalt();
    user.salt = newSalt;
    user.passwordHash = hashPassword(updates.passwordPlain, newSalt);
  }

  if (updates.email !== undefined) user.email = updates.email.trim().toLowerCase();
  if (updates.balanceCoins !== undefined) user.balanceCoins = updates.balanceCoins;
  if (updates.balanceCash !== undefined) user.balanceCash = updates.balanceCash;
  if (updates.lastSpinTime !== undefined) user.lastSpinTime = updates.lastSpinTime;
  if (updates.spinHistory !== undefined) user.spinHistory = updates.spinHistory;
  if (updates.lastDailyLoginTime !== undefined) user.lastDailyLoginTime = updates.lastDailyLoginTime;
  if (updates.freeSpinsLeft !== undefined) user.freeSpinsLeft = updates.freeSpinsLeft;

  usersCache[key] = user;
  saveDb();
  return user;
}

// Strip out credentials before sending to client
export function toClientUser(user: ServerUser) {
  return {
    username: user.username,
    email: user.email,
    balanceCoins: user.balanceCoins,
    balanceCash: user.balanceCash,
    lastSpinTime: user.lastSpinTime,
    spinHistory: user.spinHistory,
    lastDailyLoginTime: user.lastDailyLoginTime || null,
    freeSpinsLeft: user.freeSpinsLeft !== undefined ? user.freeSpinsLeft : 0,
  };
}
