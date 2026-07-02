export interface User {
  username: string;
  email: string;
  balanceCoins: number;
  balanceCash: number;
  lastSpinTime: string | null; // ISO string of last spin
  spinHistory: SpinResult[];
  lastDailyLoginTime: string | null; // ISO string of last daily login bonus claim
  freeSpinsLeft: number; // Number of free spins left for new users
}

export interface SpinResult {
  id: string;
  timestamp: string;
  prizeLabel: string;
  prizeType: "bomb" | "zonk" | "coins" | "cash";
  prizeValue: number;
  prizeIcon: string;
}

export interface Prize {
  id: string;
  type: "bomb" | "zonk" | "coins" | "cash";
  value: number;
  label: string;
  icon: string;
  color: string;
  index: number;
}

export type PageType = 
  | "LANDING" 
  | "REGISTER" 
  | "LOGIN" 
  | "THANK_YOU" 
  | "DASHBOARD" 
  | "PRIVACY" 
  | "TERMS" 
  | "ABOUT" 
  | "CONTACT"
  | "CLAIM_PRIZES";
