import type { VercelRequest, VercelResponse } from "@vercel/node";
import crypto from "crypto";

// ─── Shared State (global singleton across warm starts) ───
const g = globalThis as any;
if (!g.__gv_users) g.__gv_users = {};
const USERS: Record<string, any> = g.__gv_users;

// ─── Helpers ───
const JWT_SECRET = process.env.JWT_SECRET || "gamevault-secret-2026";

function hashPw(pw: string, salt: string) {
  return crypto.pbkdf2Sync(pw, salt, 1000, 64, "sha512").toString("hex");
}
function genSalt() { return crypto.randomBytes(16).toString("hex"); }
function genToken(payload: any) {
  const h = Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString("base64url");
  const b = Buffer.from(JSON.stringify({ ...payload, exp: Date.now() + 7 * 86400000 })).toString("base64url");
  const s = crypto.createHmac("sha256", JWT_SECRET).update(`${h}.${b}`).digest("base64url");
  return `${h}.${b}.${s}`;
}
function verifyToken(token: string): any {
  try {
    const [h, b, s] = token.split(".");
    const expected = crypto.createHmac("sha256", JWT_SECRET).update(`${h}.${b}`).digest("base64url");
    if (s !== expected) return null;
    const payload = JSON.parse(Buffer.from(b, "base64url").toString());
    if (payload.exp && Date.now() > payload.exp) return null;
    return payload;
  } catch { return null; }
}
function getUser(token: string) {
  const payload = verifyToken(token);
  if (!payload) return null;
  return USERS[payload.username?.toLowerCase()] || null;
}
function clientUser(u: any) {
  return {
    username: u.username, email: u.email,
    balanceCoins: u.balanceCoins, balanceCash: u.balanceCash,
    lastSpinTime: u.lastSpinTime, spinHistory: u.spinHistory,
    lastDailyLoginTime: u.lastDailyLoginTime, freeSpinsLeft: u.freeSpinsLeft,
  };
}

// ─── Prize Config ───
const PRIZES = [
  { type: "cash", value: 0.5, label: "$0.5 CASH", icon: "💵", index: 0 },
  { type: "coins", value: 500, label: "500 COINS", icon: "🪙", index: 1 },
  { type: "zonk", value: 0, label: "ZONK", icon: "💨", index: 2 },
  { type: "cash", value: 1, label: "$1 CASH", icon: "💵", index: 3 },
  { type: "cash", value: 5, label: "$5 CASH", icon: "💵", index: 4 },
  { type: "coins", value: 100, label: "100 COINS", icon: "🪙", index: 5 },
  { type: "cash", value: 10, label: "$10 CASH", icon: "💵", index: 6 },
  { type: "cash", value: 100, label: "$100 CASH!", icon: "🏆", index: 7 },
  { type: "coins", value: 10, label: "10 COINS", icon: "🪙", index: 8 },
  { type: "coins", value: 20, label: "20 COINS", icon: "🪙", index: 9 },
  { type: "coins", value: 50, label: "50 COINS", icon: "🪙", index: 10 },
  { type: "coins", value: 200, label: "200 COINS", icon: "🪙", index: 11 },
];

// ─── Main Handler ───
export default function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") return res.status(200).end();

  // Extract action from query: /api/auth?action=register
  const action = (req.query.action as string) || "";

  switch (action) {
    case "register": return handleRegister(req, res);
    case "login": return handleLogin(req, res);
    case "me": return handleMe(req, res);
    case "spin": return handleSpin(req, res);
    case "contact": return handleContact(req, res);
    case "claim-daily-bonus": return handleClaimDailyBonus(req, res);
    case "bypass-daily-timer": return handleBypassDailyTimer(req, res);
    case "update-profile": return handleUpdateProfile(req, res);
    case "bypass-timer": return handleBypassTimer(req, res);
    case "clear-history": return handleClearHistory(req, res);
    case "cashout": return handleCashout(req, res);
    default: return res.status(404).json({ error: "Unknown action" });
  }
}

// ─── Register ───
function handleRegister(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  const { username, email, password } = req.body;

  if (!username || !email || !password) return res.status(400).json({ error: "All fields are required." });
  if (username.trim().length < 3) return res.status(400).json({ error: "Username must be at least 3 characters." });
  if (!email.includes("@")) return res.status(400).json({ error: "Invalid email format." });
  if (password.length < 6) return res.status(400).json({ error: "Password must be at least 6 characters." });

  const key = username.trim().toLowerCase();
  if (USERS[key]) return res.status(400).json({ error: "Username is already taken." });
  for (const u of Object.values(USERS)) {
    if (u.email === email.trim().toLowerCase()) return res.status(400).json({ error: "Email is already registered." });
  }

  const salt = genSalt();
  const user = {
    username: username.trim(), email: email.trim().toLowerCase(),
    passwordHash: hashPw(password, salt), salt,
    balanceCoins: 100, balanceCash: 0,
    lastSpinTime: null, spinHistory: [],
    lastDailyLoginTime: null, freeSpinsLeft: 10,
  };
  USERS[key] = user;
  const token = genToken({ username: user.username, email: user.email });
  return res.status(201).json({ success: true, user: clientUser(user), token });
}

// ─── Login ───
function handleLogin(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: "Email and password are required." });

  let found: any = null;
  for (const u of Object.values(USERS)) {
    if (u.email === email.trim().toLowerCase()) { found = u; break; }
  }
  if (!found) return res.status(401).json({ error: "Invalid email or password." });
  if (hashPw(password, found.salt) !== found.passwordHash) return res.status(401).json({ error: "Invalid email or password." });

  const token = genToken({ username: found.username, email: found.email });
  return res.json({ success: true, user: clientUser(found), token });
}

// ─── Me (verify token) ───
function handleMe(req: VercelRequest, res: VercelResponse) {
  const auth = req.headers.authorization;
  const token = auth?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "No token" });
  const user = getUser(token);
  if (!user) return res.status(403).json({ error: "Invalid token" });
  return res.json({ success: true, user: clientUser(user) });
}

// ─── Spin ───
function handleSpin(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  const auth = req.headers.authorization;
  const token = auth?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "No token" });
  const user = getUser(token);
  if (!user) return res.status(403).json({ error: "Invalid token" });

  const hasFreeSpins = user.freeSpinsLeft > 0;
  if (!hasFreeSpins && user.lastSpinTime) {
    const diff = new Date(user.lastSpinTime).getTime() + 86400000 - Date.now();
    if (diff > 0) return res.status(400).json({ error: "Daily spin is not available yet!" });
  }

  const roll = Math.random() * 100;
  let prize: any;
  if (roll < 15) prize = PRIZES[2];       // Zonk 15%
  else if (roll < 30) prize = PRIZES[8];  // 10 Coins 15%
  else if (roll < 45) prize = PRIZES[9];  // 20 Coins 15%
  else if (roll < 55) prize = PRIZES[10]; // 50 Coins 10%
  else if (roll < 65) prize = PRIZES[5];  // 100 Coins 10%
  else if (roll < 73) prize = PRIZES[11]; // 200 Coins 8%
  else if (roll < 76) prize = PRIZES[1];  // 500 Coins 3%
  else if (roll < 81) prize = PRIZES[0];  // $0.5 Cash 5%
  else if (roll < 86) prize = PRIZES[3];  // $1 Cash 5%
  else if (roll < 90) prize = PRIZES[4];  // $5 Cash 4%
  else if (roll < 99.99) prize = PRIZES[6]; // $10 Cash 10%
  else prize = PRIZES[7];                 // $100 Cash 0.01%

  if (prize.type === "coins") user.balanceCoins += prize.value;
  else if (prize.type === "cash") user.balanceCash += prize.value;

  const ts = new Date().toISOString();
  user.spinHistory = [{ id: Math.random().toString(36).slice(2, 9), timestamp: ts, prizeLabel: prize.label, prizeType: prize.type, prizeValue: prize.value, prizeIcon: prize.icon }, ...user.spinHistory];
  user.lastSpinTime = ts;
  if (hasFreeSpins) user.freeSpinsLeft = Math.max(0, user.freeSpinsLeft - 1);

  return res.json({ success: true, roll, prize, updatedUser: clientUser(user) });
}

// ─── Contact ───
function handleContact(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  const { name, email, message } = req.body;
  if (!name || !email || !message) return res.status(400).json({ error: "All fields are required." });
  return res.json({ success: true, message: "Thank you for contacting us!" });
}

// ─── Claim Daily Bonus ───
function handleClaimDailyBonus(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  const user = getUser(req.headers.authorization?.split(" ")[1] || "");
  if (!user) return res.status(403).json({ error: "Invalid token" });
  if (user.lastDailyLoginTime) {
    const diff = new Date(user.lastDailyLoginTime).getTime() + 86400000 - Date.now();
    if (diff > 0) return res.status(400).json({ error: "Daily bonus not available yet!" });
  }
  user.balanceCoins += 25;
  user.lastDailyLoginTime = new Date().toISOString();
  return res.json({ success: true, coinsGranted: 25, user: clientUser(user) });
}

// ─── Bypass Daily Timer ───
function handleBypassDailyTimer(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  const user = getUser(req.headers.authorization?.split(" ")[1] || "");
  if (!user) return res.status(403).json({ error: "Invalid token" });
  user.lastDailyLoginTime = null;
  return res.json({ success: true, user: clientUser(user) });
}

// ─── Update Profile ───
function handleUpdateProfile(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  const user = getUser(req.headers.authorization?.split(" ")[1] || "");
  if (!user) return res.status(403).json({ error: "Invalid token" });
  const { email, password } = req.body;
  if (email && email.includes("@")) user.email = email.trim().toLowerCase();
  if (password && password.length >= 6 && password !== "••••••••") {
    const salt = genSalt();
    user.salt = salt;
    user.passwordHash = hashPw(password, salt);
  }
  return res.json({ success: true, user: clientUser(user) });
}

// ─── Bypass Spin Timer ───
function handleBypassTimer(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  const user = getUser(req.headers.authorization?.split(" ")[1] || "");
  if (!user) return res.status(403).json({ error: "Invalid token" });
  user.lastSpinTime = null;
  user.freeSpinsLeft = 10;
  return res.json({ success: true, user: clientUser(user) });
}

// ─── Clear History ───
function handleClearHistory(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  const user = getUser(req.headers.authorization?.split(" ")[1] || "");
  if (!user) return res.status(403).json({ error: "Invalid token" });
  user.spinHistory = [];
  return res.json({ success: true, user: clientUser(user) });
}

// ─── Cashout ───
function handleCashout(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  const user = getUser(req.headers.authorization?.split(" ")[1] || "");
  if (!user) return res.status(403).json({ error: "Invalid token" });
  const { amount, method, email } = req.body;
  const parsedAmount = parseFloat(amount);
  if (isNaN(parsedAmount) || parsedAmount <= 0) return res.status(400).json({ error: "Invalid amount." });

  if (method === "USD_PAYPAL") {
    if (parsedAmount > user.balanceCash) return res.status(400).json({ error: "Insufficient cash balance." });
    if (parsedAmount < 10) return res.status(400).json({ error: "Minimum withdrawal is $10.00." });
    user.balanceCash -= parsedAmount;
    return res.json({ success: true, message: `Withdrawal of $${parsedAmount.toFixed(2)} requested.`, user: clientUser(user) });
  }
  const requiredCoins = parsedAmount * 10;
  if (user.balanceCoins < requiredCoins) return res.status(400).json({ error: `Need ${requiredCoins} Coins.` });
  user.balanceCoins -= requiredCoins;
  return res.json({ success: true, message: `Gift card $${parsedAmount}.00 processing.`, user: clientUser(user) });
}
