import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { getUserByEmail, getUserByUsername, createUser, updateUser, toClientUser, hashPassword } from "./src/server/db";
import { generateToken, authenticateToken, AuthenticatedRequest } from "./src/server/auth";

// Define the spin prizes matching the wheel segments
interface Prize {
  id: string;
  type: "bomb" | "zonk" | "coins" | "cash";
  value: number;
  label: string;
  icon: string;
  color: string;
  index: number; // 0-indexed segment on the wheel (total 8 segments)
}

const PRIZES: Prize[] = [
  { id: "cash_0_5", type: "cash", value: 0.5, label: "$0.5 CASH", icon: "💵", color: "#0D9488", index: 0 },
  { id: "coins_500", type: "coins", value: 500, label: "500 COINS", icon: "🪙", color: "#06B6D4", index: 1 },
  { id: "zonk", type: "zonk", value: 0, label: "ZONK", icon: "💨", color: "#64748B", index: 2 },
  { id: "cash_1", type: "cash", value: 1, label: "$1 CASH", icon: "💵", color: "#10B981", index: 3 },
  { id: "cash_5", type: "cash", value: 5, label: "$5 CASH", icon: "💵", color: "#4F46E5", index: 4 },
  { id: "coins_100", type: "coins", value: 100, label: "100 COINS", icon: "🪙", color: "#2563EB", index: 5 },
  { id: "cash_10", type: "cash", value: 10, label: "$10 CASH", icon: "💵", color: "#9333EA", index: 6 },
  { id: "cash_100", type: "cash", value: 100, label: "$100 CASH!", icon: "🏆", color: "#D97706", index: 7 },
  { id: "coins_10", type: "coins", value: 10, label: "10 COINS", icon: "🪙", color: "#3B82F6", index: 8 },
  { id: "coins_20", type: "coins", value: 20, label: "20 COINS", icon: "🪙", color: "#6366F1", index: 9 },
  { id: "coins_50", type: "coins", value: 50, label: "50 COINS", icon: "🪙", color: "#8B5CF6", index: 10 },
  { id: "coins_200", type: "coins", value: 200, label: "200 COINS", icon: "🪙", color: "#EC4899", index: 11 },
];

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // ==================== AUTHENTICATION ENDPOINTS ====================

  // Register Endpoint
  app.post("/api/auth/register", (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: "All fields are required." });
    }

    if (username.trim().length < 3) {
      return res.status(400).json({ error: "Username must be at least 3 characters." });
    }

    if (!email.includes("@")) {
      return res.status(400).json({ error: "Invalid email format." });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters." });
    }

    if (getUserByUsername(username)) {
      return res.status(400).json({ error: "Username is already taken. Please choose another." });
    }

    if (getUserByEmail(email)) {
      return res.status(400).json({ error: "Email is already registered." });
    }

    try {
      const user = createUser(username, email, password);
      const token = generateToken({ username: user.username, email: user.email });

      res.status(201).json({
        success: true,
        user: toClientUser(user),
        token,
      });
    } catch (err) {
      res.status(500).json({ error: "Registration failed." });
    }
  });

  // Login Endpoint
  app.post("/api/auth/login", (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required." });
    }

    const user = getUserByEmail(email);
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    const hashed = hashPassword(password, user.salt);
    if (hashed !== user.passwordHash) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    const token = generateToken({ username: user.username, email: user.email });

    res.json({
      success: true,
      user: toClientUser(user),
      token,
    });
  });

  // Get current user profile endpoint (Auth verification)
  app.get("/api/auth/me", authenticateToken as any, (req: AuthenticatedRequest, res) => {
    res.json({
      success: true,
      user: toClientUser(req.user!),
    });
  });

  // Update profile endpoint
  app.post("/api/auth/update-profile", authenticateToken as any, (req: AuthenticatedRequest, res) => {
    const { email, password } = req.body;
    const user = req.user!;

    const updates: any = {};
    if (email && email.trim() !== "") {
      if (!email.includes("@")) {
        return res.status(400).json({ error: "Invalid email format." });
      }
      // Check if email already used by someone else
      const existing = getUserByEmail(email);
      if (existing && existing.username.toLowerCase() !== user.username.toLowerCase()) {
        return res.status(400).json({ error: "Email is already in use by another user." });
      }
      updates.email = email;
    }

    if (password && password.trim() !== "" && password !== "••••••••") {
      if (password.length < 6) {
        return res.status(400).json({ error: "Password must be at least 6 characters." });
      }
      updates.passwordPlain = password;
    }

    const updated = updateUser(user.username, updates);
    if (!updated) {
      return res.status(500).json({ error: "Failed to update profile." });
    }

    res.json({
      success: true,
      user: toClientUser(updated),
    });
  });

  // Cashout / conversion endpoint (secure server validation)
  app.post("/api/auth/cashout", authenticateToken as any, (req: AuthenticatedRequest, res) => {
    const { amount, method, email } = req.body;
    const user = req.user!;

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      return res.status(400).json({ error: "Invalid withdrawal amount." });
    }

    if (method === "USD_PAYPAL") {
      if (parsedAmount > user.balanceCash) {
        return res.status(400).json({ error: `Insufficient cash balance. You only have $${user.balanceCash.toFixed(2)}.` });
      }
      if (parsedAmount < 10) {
        return res.status(400).json({ error: "The minimum withdrawal amount is $10.00 CASH." });
      }

      const updated = updateUser(user.username, {
        balanceCash: user.balanceCash - parsedAmount,
      });

      if (!updated) return res.status(500).json({ error: "Failed to update balances." });

      return res.json({
        success: true,
        message: `Successfully requested withdrawal of $${parsedAmount.toFixed(2)} to PayPal (${email}). The transaction is currently under review.`,
        user: toClientUser(updated),
      });

    } else {
      // GIFT CARD COIN REDEMPTION
      const requiredCoins = parsedAmount * 10;
      if (user.balanceCoins < requiredCoins) {
        return res.status(400).json({ error: `Insufficient coin balance. You need ${requiredCoins} Coins.` });
      }

      const updated = updateUser(user.username, {
        balanceCoins: user.balanceCoins - requiredCoins,
      });

      if (!updated) return res.status(500).json({ error: "Failed to update balances." });

      return res.json({
        success: true,
        message: `Claim successful! Amazon Gift Card Voucher of $${parsedAmount}.00 is being processed. The digital voucher code will be sent to ${user.email} within 24 hours.`,
        user: toClientUser(updated),
      });
    }
  });

  // Bypass cooldown timer endpoint for reviewers
  app.post("/api/auth/bypass-timer", authenticateToken as any, (req: AuthenticatedRequest, res) => {
    const user = req.user!;
    const updated = updateUser(user.username, {
      lastSpinTime: null,
      freeSpinsLeft: 10, // Restores the 10 free spins for testing!
    });
    if (!updated) return res.status(500).json({ error: "Failed to reset timer." });
    res.json({
      success: true,
      user: toClientUser(updated),
    });
  });

  // Claim Daily Login Bonus endpoint
  app.post("/api/auth/claim-daily-bonus", authenticateToken as any, (req: AuthenticatedRequest, res) => {
    const user = req.user!;
    
    if (user.lastDailyLoginTime) {
      const lastClaim = new Date(user.lastDailyLoginTime).getTime();
      const now = Date.now();
      const difference = lastClaim + (24 * 60 * 60 * 1000) - now;
      if (difference > 0) {
        return res.status(400).json({ error: "Your Daily Login Bonus is not available yet!" });
      }
    }

    const bonusCoins = 25;
    const timestampStr = new Date().toISOString();
    const updated = updateUser(user.username, {
      balanceCoins: user.balanceCoins + bonusCoins,
      lastDailyLoginTime: timestampStr,
    });

    if (!updated) {
      return res.status(500).json({ error: "Failed to claim Daily Login Bonus on the server." });
    }

    res.json({
      success: true,
      coinsGranted: bonusCoins,
      user: toClientUser(updated),
    });
  });

  // Bypass Daily Login Bonus timer for testing
  app.post("/api/auth/bypass-daily-timer", authenticateToken as any, (req: AuthenticatedRequest, res) => {
    const user = req.user!;
    const updated = updateUser(user.username, {
      lastDailyLoginTime: null,
    });
    if (!updated) return res.status(500).json({ error: "Failed to reset daily login timer." });
    res.json({
      success: true,
      user: toClientUser(updated),
    });
  });

  // Clear Game Spin History logs
  app.post("/api/auth/clear-history", authenticateToken as any, (req: AuthenticatedRequest, res) => {
    const user = req.user!;
    const updated = updateUser(user.username, {
      spinHistory: [],
    });
    if (!updated) return res.status(500).json({ error: "Failed to clear history." });
    res.json({
      success: true,
      user: toClientUser(updated),
    });
  });

  // API Route for Spin calculations (secure server-side odds & server-side persistence)
  app.post("/api/spin", authenticateToken as any, (req: AuthenticatedRequest, res) => {
    const user = req.user!;
    const hasFreeSpins = user.freeSpinsLeft > 0;
    
    // Check daily cooldown (24 hours) only if they do not have welcome free spins left!
    if (!hasFreeSpins && user.lastSpinTime) {
      const lastSpin = new Date(user.lastSpinTime).getTime();
      const now = Date.now();
      const difference = lastSpin + (24 * 60 * 60 * 1000) - now;
      if (difference > 0) {
        return res.status(400).json({ error: "Daily spin is not available yet!" });
      }
    }

    // Generate a random roll between 0 and 100
    const roll = Math.random() * 100;
    
    // Secure 12-segment Prize odds (server-side):
    // Zonk: 15.0% (index 2)
    // 10 Coins: 15.0% (index 8)
    // 20 Coins: 15.0% (index 9)
    // 50 Coins: 10.0% (index 10)
    // 100 Coins: 10.0% (index 5)
    // 200 Coins: 8.0% (index 11)
    // 500 Coins: 3.0% (index 1)
    // $0.5 Cash: 5.0% (index 0)
    // $1 Cash: 5.0% (index 3)
    // $5 Cash: 3.99% (index 4)
    // $10 Cash: 10.0% (index 6) [Increased winrate!]
    // $100 Cash: 0.01% (index 7) [Decreased winrate!]
    // Sum = 100%
    
    let selectedPrize: Prize;
    
    if (roll < 15.0) {
      selectedPrize = PRIZES[2]; // Zonk (15.0%)
    } else if (roll < 15.0 + 15.0) {
      selectedPrize = PRIZES[8]; // 10 Coins (15.0%)
    } else if (roll < 15.0 + 15.0 + 15.0) {
      selectedPrize = PRIZES[9]; // 20 Coins (15.0%)
    } else if (roll < 15.0 + 15.0 + 15.0 + 10.0) {
      selectedPrize = PRIZES[10]; // 50 Coins (10.0%)
    } else if (roll < 15.0 + 15.0 + 15.0 + 10.0 + 10.0) {
      selectedPrize = PRIZES[5]; // 100 Coins (10.0%)
    } else if (roll < 15.0 + 15.0 + 15.0 + 10.0 + 10.0 + 8.0) {
      selectedPrize = PRIZES[11]; // 200 Coins (8.0%)
    } else if (roll < 15.0 + 15.0 + 15.0 + 10.0 + 10.0 + 8.0 + 3.0) {
      selectedPrize = PRIZES[1]; // 500 Coins (3.0%)
    } else if (roll < 15.0 + 15.0 + 15.0 + 10.0 + 10.0 + 8.0 + 3.0 + 5.0) {
      selectedPrize = PRIZES[0]; // $0.5 Cash (5.0%)
    } else if (roll < 15.0 + 15.0 + 15.0 + 10.0 + 10.0 + 8.0 + 3.0 + 5.0 + 5.0) {
      selectedPrize = PRIZES[3]; // $1 Cash (5.0%)
    } else if (roll < 15.0 + 15.0 + 15.0 + 10.0 + 10.0 + 8.0 + 3.0 + 5.0 + 5.0 + 3.99) {
      selectedPrize = PRIZES[4]; // $5 Cash (3.99%)
    } else if (roll < 15.0 + 15.0 + 15.0 + 10.0 + 10.0 + 8.0 + 3.0 + 5.0 + 5.0 + 3.99 + 10.0) {
      selectedPrize = PRIZES[6]; // $10 Cash (10.0%)
    } else {
      selectedPrize = PRIZES[7]; // $100 Cash (0.01%)
    }

    // Apply reward to the user's secure server-side record
    let newCoins = user.balanceCoins;
    let newCash = user.balanceCash;

    if (selectedPrize.type === "coins") {
      newCoins += selectedPrize.value;
    } else if (selectedPrize.type === "cash") {
      newCash += selectedPrize.value;
    }

    const timestampStr = new Date().toISOString();
    const newResult = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: timestampStr,
      prizeLabel: selectedPrize.label,
      prizeType: selectedPrize.type,
      prizeValue: selectedPrize.value,
      prizeIcon: selectedPrize.icon,
    };

    const newFreeSpinsLeft = hasFreeSpins ? Math.max(0, user.freeSpinsLeft - 1) : 0;

    const updated = updateUser(user.username, {
      balanceCoins: newCoins,
      balanceCash: newCash,
      lastSpinTime: timestampStr,
      spinHistory: [newResult, ...user.spinHistory],
      freeSpinsLeft: newFreeSpinsLeft,
    });

    if (!updated) {
      return res.status(500).json({ error: "Failed to update user balances on the server." });
    }

    // Calculate a secure token or verification timestamp
    const timestamp = Date.now();
    const serverSignature = Buffer.from(JSON.stringify({ roll, selectedPrize, timestamp })).toString("base64");

    res.json({
      success: true,
      roll,
      prize: selectedPrize,
      serverSignature,
      timestamp,
      updatedUser: toClientUser(updated),
    });
  });

  // API Route for general support contact
  app.post("/api/contact", (req, res) => {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ error: "All fields are required." });
    }
    // Simulation of contact request saving
    res.json({ success: true, message: "Thank you for contacting us! We will get back to you shortly." });
  });

  // Vite integration middleware
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT} in ${process.env.NODE_ENV || "development"} mode`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
});
