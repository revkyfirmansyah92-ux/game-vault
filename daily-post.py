#!/usr/bin/env python3
"""
Game Vault — Auto Post Generator
Generate daily Facebook/Instagram post dengan hashtag random.
"""

import random
from datetime import datetime

# Link Game Vault lo
LINK = "https://freegamevault.web.id"

# Template post
TEMPLATES = [
    """🎁CONGRATULATIONS🎁
𝗕𝗼𝗻𝘂𝘀 𝗙𝗼𝗿 𝗧𝗼𝗱𝗮𝘆, 𝗖𝗹𝗮𝗶𝗺 𝗙𝗿𝗲𝗲 COINS 50,000 𝗙𝗢𝗥 𝗘𝗩𝗘𝗥𝗬𝗢𝗡𝗘 🎁 🎉

𝗦𝘁𝗲𝗽 𝟭 = 𝗟𝗶𝗸𝗲 𝗮𝗻𝗱 𝗦𝗵𝗮𝗿𝗲
𝗦𝘁𝗲𝗽 𝟮 = 𝗖𝗼𝗺𝗺𝗲𝗻𝘁𝘀 " Ready "
𝗦𝘁𝗲𝗽 𝟯 = Claim Bonus 👉 {link}

💫 𝗚𝗼𝗼𝗱 𝗟𝘂𝗰𝗸 💫

{hashtags}""",

    """🎰 FREE SPIN ALERT! 🎰
Win up to $100 CASH or 50,000 COINS — NO DEPOSIT needed! 💰

✅ Step 1: Like this post
✅ Step 2: Comment "WIN"
✅ Step 3: Spin the wheel 👉 {link}

🔥 Limited time only! Don't miss out! 🔥

{hashtags}""",

    """💰 FREE MONEY GIVEAWAY 💰
We're giving away FREE coins to everyone today! 🎉

👉 Like & Share
👉 Comment "CLAIM"
👉 Get your reward here 👉 {link}

⚡ Hurry — offer ends soon!

{hashtags}""",

    """🎮 GAME VAULT REWARDS 🎮
New players get 100 COINS + 10 FREE SPINS just for signing up! 🎁

How to claim:
1️⃣ Like this post
2️⃣ Share with friends
3️⃣ Sign up 👉 {link}

💵 Win real cash prizes up to $100!

{hashtags}""",

    """🏆 TODAY'S LUCKY DRAW 🏆
Free entry — no deposit required! 💎

🎯 Spin the wheel & win:
• $100 Cash 💵
• 50,000 Coins 🪙
• Gift Cards 🎁

Enter now 👉 {link}

{hashtags}""",
]

# Pool hashtag — random pick setiap hari
HASHTAG_POOL = [
    "#freegiveaway", "#freecoins", "#winmoney", "#freerewards",
    "#cashtoday", "#giveawayalert", "#freebies", "#wingiftcard",
    "#freemoney", "#dailygiveaway", "#prizes", "#luckyday",
    "#winnerwinner", "#claimnow", "#instantrewards", "#cashprizes",
    "#freebiefriday", "#winbig", "#rewardtime", "#bonusday",
    "#freegaming", "#mobilegaming", "#gamevault", "#spinandwin",
    "#freedownload", "#makemoneyonline", "#earnmoney", "#sidehustle",
    "#passiveincome", "#freeoffer", "#limitedtime", "#actnow",
    "#dontmissout", "#exclusiveoffer", "#viprewards", "#premiumgift",
    "#treasurehunt", "#jackpot", "#megawin", "#bighit",
]

def generate_post():
    """Generate a random post with unique hashtags."""
    template = random.choice(TEMPLATES)
    hashtags = " ".join(random.sample(HASHTAG_POOL, 10))
    post = template.format(link=LINK, hashtags=hashtags)
    return post

if __name__ == "__main__":
    print("=" * 50)
    print(f"📅 Date: {datetime.now().strftime('%Y-%m-%d %H:%M')}")
    print("=" * 50)
    print()
    print(generate_post())
    print()
    print("=" * 50)
    print("Copy post di atas, paste ke Facebook/TikTok/IG!")
