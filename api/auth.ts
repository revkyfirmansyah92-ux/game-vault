import crypto from "crypto";

// ─── Shared State ───
const g = globalThis as any;
if (!g.__gv) g.__gv = {};
const USERS: Record<string, any> = g.__gv;

// ─── Helpers ───
const JWT_SECRET = process.env.JWT_SECRET || "gamevault-secret-2026";
function hashPw(pw: string, salt: string) { return crypto.pbkdf2Sync(pw, salt, 1000, 64, "sha512").toString("hex"); }
function genSalt() { return crypto.randomBytes(16).toString("hex"); }
function genToken(p: any) {
  const h = Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString("base64url");
  const b = Buffer.from(JSON.stringify({ ...p, exp: Date.now() + 604800000 })).toString("base64url");
  const s = crypto.createHmac("sha256", JWT_SECRET).update(`${h}.${b}`).digest("base64url");
  return `${h}.${b}.${s}`;
}
function verify(token: string) {
  try {
    const [h, b, s] = token.split(".");
    if (s !== crypto.createHmac("sha256", JWT_SECRET).update(`${h}.${b}`).digest("base64url")) return null;
    const p = JSON.parse(Buffer.from(b, "base64url").toString());
    if (p.exp && Date.now() > p.exp) return null;
    return p;
  } catch { return null; }
}
function getUser(token: string) {
  const p = verify(token);
  return p ? USERS[p.username?.toLowerCase()] || null : null;
}
function clean(u: any) {
  return { username: u.username, email: u.email, balanceCoins: u.balanceCoins, balanceCash: u.balanceCash, lastSpinTime: u.lastSpinTime, spinHistory: u.spinHistory, lastDailyLoginTime: u.lastDailyLoginTime, freeSpinsLeft: u.freeSpinsLeft };
}

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

export default function handler(req: any, res: any) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") return res.status(200).end();

  const action = (req.query.action as string) || "";

  // REGISTER
  if (action === "register") {
    if (req.method !== "POST") return res.status(405).json({ error: "POST only" });
    const { username, email, password } = req.body;
    if (!username || !email || !password) return res.status(400).json({ error: "All fields required." });
    if (username.trim().length < 3) return res.status(400).json({ error: "Username min 3 chars." });
    if (!email.includes("@")) return res.status(400).json({ error: "Invalid email." });
    if (password.length < 6) return res.status(400).json({ error: "Password min 6 chars." });
    const key = username.trim().toLowerCase();
    if (USERS[key]) return res.status(400).json({ error: "Username taken." });
    for (const u of Object.values(USERS)) { if (u.email === email.trim().toLowerCase()) return res.status(400).json({ error: "Email registered." }); }
    const salt = genSalt();
    const user = { username: username.trim(), email: email.trim().toLowerCase(), passwordHash: hashPw(password, salt), salt, balanceCoins: 100, balanceCash: 0, lastSpinTime: null, spinHistory: [], lastDailyLoginTime: null, freeSpinsLeft: 10 };
    USERS[key] = user;
    return res.status(201).json({ success: true, user: clean(user), token: genToken({ username: user.username, email: user.email }) });
  }

  // LOGIN
  if (action === "login") {
    if (req.method !== "POST") return res.status(405).json({ error: "POST only" });
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: "Email & password required." });
    let found: any = null;
    for (const u of Object.values(USERS)) { if (u.email === email.trim().toLowerCase()) { found = u; break; } }
    if (!found || hashPw(password, found.salt) !== found.passwordHash) return res.status(401).json({ error: "Invalid credentials." });
    return res.json({ success: true, user: clean(found), token: genToken({ username: found.username, email: found.email }) });
  }

  // ME
  if (action === "me") {
    const user = getUser(req.headers.authorization?.split(" ")[1] || "");
    if (!user) return res.status(401).json({ error: "Invalid token" });
    return res.json({ success: true, user: clean(user) });
  }

  // SPIN
  if (action === "spin") {
    if (req.method !== "POST") return res.status(405).json({ error: "POST only" });
    const user = getUser(req.headers.authorization?.split(" ")[1] || "");
    if (!user) return res.status(401).json({ error: "Invalid token" });
    const hasFree = user.freeSpinsLeft > 0;
    if (!hasFree && user.lastSpinTime) {
      if (new Date(user.lastSpinTime).getTime() + 86400000 > Date.now()) return res.status(400).json({ error: "Daily spin not available!" });
    }
    const roll = Math.random() * 100;
    let prize: any;
    if (roll < 15) prize = PRIZES[2]; else if (roll < 30) prize = PRIZES[8]; else if (roll < 45) prize = PRIZES[9];
    else if (roll < 55) prize = PRIZES[10]; else if (roll < 65) prize = PRIZES[5]; else if (roll < 73) prize = PRIZES[11];
    else if (roll < 76) prize = PRIZES[1]; else if (roll < 81) prize = PRIZES[0]; else if (roll < 86) prize = PRIZES[3];
    else if (roll < 90) prize = PRIZES[4]; else if (roll < 99.99) prize = PRIZES[6]; else prize = PRIZES[7];
    if (prize.type === "coins") user.balanceCoins += prize.value;
    else if (prize.type === "cash") user.balanceCash += prize.value;
    const ts = new Date().toISOString();
    user.spinHistory = [{ id: Math.random().toString(36).slice(2, 9), timestamp: ts, prizeLabel: prize.label, prizeType: prize.type, prizeValue: prize.value, prizeIcon: prize.icon }, ...user.spinHistory];
    user.lastSpinTime = ts;
    if (hasFree) user.freeSpinsLeft = Math.max(0, user.freeSpinsLeft - 1);
    return res.json({ success: true, roll, prize, updatedUser: clean(user) });
  }

  // CLAIM DAILY BONUS
  if (action === "claim-daily-bonus") {
    if (req.method !== "POST") return res.status(405).json({ error: "POST only" });
    const user = getUser(req.headers.authorization?.split(" ")[1] || "");
    if (!user) return res.status(401).json({ error: "Invalid token" });
    if (user.lastDailyLoginTime && new Date(user.lastDailyLoginTime).getTime() + 86400000 > Date.now()) return res.status(400).json({ error: "Not available yet!" });
    user.balanceCoins += 25; user.lastDailyLoginTime = new Date().toISOString();
    return res.json({ success: true, coinsGranted: 25, user: clean(user) });
  }

  // BYPASS DAILY TIMER
  if (action === "bypass-daily-timer") {
    if (req.method !== "POST") return res.status(405).json({ error: "POST only" });
    const user = getUser(req.headers.authorization?.split(" ")[1] || "");
    if (!user) return res.status(401).json({ error: "Invalid token" });
    user.lastDailyLoginTime = null;
    return res.json({ success: true, user: clean(user) });
  }

  // UPDATE PROFILE
  if (action === "update-profile") {
    if (req.method !== "POST") return res.status(405).json({ error: "POST only" });
    const user = getUser(req.headers.authorization?.split(" ")[1] || "");
    if (!user) return res.status(401).json({ error: "Invalid token" });
    const { email, password } = req.body;
    if (email && email.includes("@")) user.email = email.trim().toLowerCase();
    if (password && password.length >= 6 && password !== "••••••••") { const s = genSalt(); user.salt = s; user.passwordHash = hashPw(password, s); }
    return res.json({ success: true, user: clean(user) });
  }

  // BYPASS TIMER
  if (action === "bypass-timer") {
    if (req.method !== "POST") return res.status(405).json({ error: "POST only" });
    const user = getUser(req.headers.authorization?.split(" ")[1] || "");
    if (!user) return res.status(401).json({ error: "Invalid token" });
    user.lastSpinTime = null; user.freeSpinsLeft = 10;
    return res.json({ success: true, user: clean(user) });
  }

  // CLEAR HISTORY
  if (action === "clear-history") {
    if (req.method !== "POST") return res.status(405).json({ error: "POST only" });
    const user = getUser(req.headers.authorization?.split(" ")[1] || "");
    if (!user) return res.status(401).json({ error: "Invalid token" });
    user.spinHistory = [];
    return res.json({ success: true, user: clean(user) });
  }

  // CASHOUT
  if (action === "cashout") {
    if (req.method !== "POST") return res.status(405).json({ error: "POST only" });
    const user = getUser(req.headers.authorization?.split(" ")[1] || "");
    if (!user) return res.status(401).json({ error: "Invalid token" });
    const { amount, method } = req.body;
    const amt = parseFloat(amount);
    if (isNaN(amt) || amt <= 0) return res.status(400).json({ error: "Invalid amount." });
    if (method === "USD_PAYPAL") {
      if (amt > user.balanceCash) return res.status(400).json({ error: "Insufficient cash." });
      if (amt < 10) return res.status(400).json({ error: "Min $10." });
      user.balanceCash -= amt;
      return res.json({ success: true, message: `Withdrawal $${amt.toFixed(2)} requested.`, user: clean(user) });
    }
    const needed = amt * 10;
    if (user.balanceCoins < needed) return res.status(400).json({ error: `Need ${needed} Coins.` });
    user.balanceCoins -= needed;
    return res.json({ success: true, message: `Gift card $${amt}.00 processing.`, user: clean(user) });
  }

  // CONTACT
  if (action === "contact") {
    if (req.method !== "POST") return res.status(405).json({ error: "POST only" });
    const { name, email, message } = req.body;
    if (!name || !email || !message) return res.status(400).json({ error: "All fields required." });
    return res.json({ success: true, message: "Thank you for contacting us!" });
  }

  if (action === "postback") return handlePostback(req, res);
  return res.status(404).json({ error: "Unknown action" });
}

// ─── OGAds Postback → Telegram Notification ───
async function handlePostback(req: any, res: any) {
  const TG_TOKEN = "8901656074:AAESUA1j8m-W2FtKx9HOcKTdet4z5tHqt30";
  const TG_CHAT = "6359506565";

  // OGAds postback parameters (case-sensitive!)
  const q = req.query;
  const offerId = q.offer_id || "-";
  const offerName = q.offer_name || "Unknown Offer";
  const payout = q.payout || "0";
  const ip = q.session_ip || "unknown";
  const affSub = q.aff_sub || "-";
  const source = q.source || "direct";
  const date = q.date || "";
  const time = q.time || "";
  const txId = offerId

  const msg = `🎰 *NEW CONVERSION!*
🆔 Offer: \`${offerId}\`
📝 Name: ${offerName}
💵 Payout: *$${payout}*
🌐 IP: ${ip}
📊 Source: ${source}
🏷 Sub: ${affSub}
📅 ${date} ${time}`;

  try {
    await fetch(`https://api.telegram.org/bot${TG_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: TG_CHAT, text: msg, parse_mode: "Markdown" }),
    });
  } catch (e) { console.error("TG error:", e); }

  return res.status(200).send("ok");
}
