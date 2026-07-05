#!/usr/bin/env python3
"""
Game Vault — Daily Facebook Post Generator
Generate unique posts + images setiap hari dengan hashtag random.
"""

import random
import os
from datetime import datetime

LINK = "https://shorter.me/ORz14"

# ─── Post Templates ───
TEMPLATES = [
    {
        "text": """🎁CONGRATULATIONS🎁
𝗕𝗼𝗻𝘂𝘀 𝗙𝗼𝗿 𝗧𝗼𝗱𝗮𝘆, 𝗖𝗹𝗮𝗶𝗺 𝗙𝗿𝗲𝗲 COINS 50,000 𝗙𝗢𝗥 𝗘𝗩𝗘𝗥𝗬𝗢𝗡𝗘 🎁 🎉

𝗦𝘁𝗲𝗽 𝟭 = 𝗟𝗶𝗸𝗲 𝗮𝗻𝗱 𝗦𝗵𝗮𝗿𝗲
𝗦𝘁𝗲𝗽 𝟮 = 𝗖𝗼𝗺𝗺𝗲𝗻𝘁𝘀 " Ready "
𝗦𝘁𝗲𝗽 𝟯 = Claim Bonus 👉 {link}

💫 𝗚𝗼𝗼𝗱 𝗟𝘂𝗰𝗸 💫""",
        "color": "#8b5cf6",
        "emoji": "🎁",
        "headline": "FREE COINS!"
    },
    {
        "text": """🎰 FREE SPIN ALERT! 🎰
Win up to $100 CASH or 50,000 COINS — NO DEPOSIT needed! 💰

✅ Step 1: Like this post
✅ Step 2: Comment "WIN"
✅ Step 3: Spin & Win 👉 {link}

🔥 Limited time only! Don't miss out!""",
        "color": "#f59e0b",
        "emoji": "🎰",
        "headline": "FREE SPIN!"
    },
    {
        "text": """💰 FREE MONEY GIVEAWAY 💰
We're giving away FREE coins to everyone today! 🎉

👉 Like & Share
👉 Comment "CLAIM"
👉 Get your reward 👉 {link}

⚡ Hurry — offer ends soon!""",
        "color": "#22c55e",
        "emoji": "💰",
        "headline": "FREE MONEY!"
    },
    {
        "text": """🎮 GAME VAULT REWARDS 🎮
New players get 100 COINS + 10 FREE SPINS just for signing up! 🎁

How to claim:
1️⃣ Like this post
2️⃣ Share with friends
3️⃣ Sign up 👉 {link}

💵 Win real cash prizes up to $100!""",
        "color": "#3b82f6",
        "emoji": "🎮",
        "headline": "FREE SPINS!"
    },
    {
        "text": """🏆 TODAY'S LUCKY DRAW 🏆
Free entry — no deposit required! 💎

🎯 Spin the wheel & win:
• $100 Cash 💵
• 50,000 Coins 🪙
• Gift Cards 🎁

Enter now 👉 {link}""",
        "color": "#ec4899",
        "emoji": "🏆",
        "headline": "LUCKY DRAW!"
    },
    {
        "text": """⚠️ BURUAN! Coin gratis 50.000 buat semua orang! 🪙

Cuma hari ini aja! Langsung klaim 👉 {link}

Like + Share + Comment "DONE" ✅

Selamat mencoba! 💫""",
        "color": "#ef4444",
        "emoji": "⚠️",
        "headline": "COIN GRATIS!"
    },
]

# ─── Hashtag Pools (organized by category) ───
HASHTAG_POOLS = {
    "general": [
        "#freegiveaway", "#freecoins", "#winmoney", "#freerewards",
        "#cashtoday", "#giveawayalert", "#freebies", "#wingiftcard",
        "#freemoney", "#dailygiveaway", "#prizes", "#luckyday",
        "#winnerwinner", "#claimnow", "#instantrewards", "#cashprizes",
    ],
    "gaming": [
        "#gamevault", "#spinandwin", "#mobilegaming", "#freegaming",
        "#gamerlife", "#gamingcommunity", "#freeplay", "#wingame",
        "#jackpot", "#megawin", "#bighit", "#treasurehunt",
    ],
    "money": [
        "#earnmoney", "#makemoneyonline", "#sidehustle", "#passiveincome",
        "#moneytips", "#financialfreedom", "#hustlehard", "#moneygoals",
        "#earnonline", "#workfromhome", "#extramoney", "#cashflow",
    ],
    "viral": [
        "#viral", "#trending", "#fyp", "#foryou", "#viralvideo",
        "#trend", "#explore", "#reels", "#share", "#like",
        "#follow", "#subscribe", "#viralpost", "#trendingnow",
    ],
    "promo": [
        "#limitedtime", "#exclusiveoffer", "#viprewards", "#bonusday",
        "#rewardtime", "#freebiefriday", "#actnow", "#dontmissout",
        "#specialoffer", "#hotdeal", "#flashsale", "#bonusreward",
    ],
}

def get_daily_hashtags(count=12):
    """Get random hashtags, different each day."""
    random.seed(datetime.now().strftime("%Y-%m-%d"))  # Same hashtags within a day
    all_tags = []
    for pool in HASHTAG_POOLS.values():
        all_tags.extend(pool)
    selected = random.sample(all_tags, min(count, len(all_tags)))
    return " ".join(selected)

def get_daily_template():
    """Get a different template each day."""
    random.seed(datetime.now().strftime("%Y-%m-%d"))
    return random.choice(TEMPLATES)

def generate_post():
    """Generate daily post text."""
    template = get_daily_template()
    hashtags = get_daily_hashtags(12)
    post = template["text"].format(link=LINK)
    return f"{post}\n\n{hashtags}"

def generate_html_image():
    """Generate HTML image for the post."""
    template = get_daily_template()
    hashtags = get_daily_hashtags(8)
    date_str = datetime.now().strftime("%B %d, %Y")
    
    html = f"""<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>
*{{margin:0;padding:0;box-sizing:border-box}}
body{{width:1080px;height:1080px;background:linear-gradient(135deg,#0a0a1a,#1a1033,#0a0a1a);font-family:'Segoe UI',sans-serif;color:#fff;display:flex;align-items:center;justify-content:center;overflow:hidden}}
.container{{text-align:center;padding:60px;width:100%}}
.emoji{{font-size:120px;margin-bottom:20px;animation:bounce 2s infinite}}
@keyframes bounce{{0%,100%{{transform:translateY(0)}}50%{{transform:translateY(-20px)}}}}
h1{{font-size:72px;font-weight:900;margin-bottom:20px;background:linear-gradient(135deg,{template['color']},#22d3ee);-webkit-background-clip:text;-webkit-text-fill-color:transparent}}
.sub{{font-size:28px;color:#94a3b8;margin-bottom:40px;line-height:1.5}}
.btn{{display:inline-block;padding:20px 60px;background:linear-gradient(135deg,{template['color']},#ec4899);border-radius:16px;font-size:28px;font-weight:700;margin-bottom:30px;box-shadow:0 10px 40px {template['color']}44}}
.features{{display:flex;justify-content:center;gap:30px;margin-bottom:40px}}
.feature{{background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.1);border-radius:16px;padding:20px 30px}}
.feature-icon{{font-size:36px;margin-bottom:8px}}
.feature-text{{font-size:18px;color:#94a3b8}}
.hashtags{{font-size:16px;color:#64748b;margin-top:20px;word-wrap:break-word}}
.date{{position:absolute;bottom:30px;right:40px;font-size:14px;color:#475569}}
.brand{{position:absolute;top:30px;left:40px;font-size:24px;font-weight:700;color:#6366f1}}
.particles{{position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none}}
.particle{{position:absolute;width:6px;height:6px;border-radius:50%;background:rgba(255,255,255,.15)}}
</style>
</head>
<body>
<div class="particles">
    <div class="particle" style="top:10%;left:15%;background:rgba(139,92,246,.3)"></div>
    <div class="particle" style="top:20%;left:80%;background:rgba(34,211,238,.3)"></div>
    <div class="particle" style="top:70%;left:10%;background:rgba(236,72,153,.3)"></div>
    <div class="particle" style="top:80%;left:85%;background:rgba(34,197,94,.3)"></div>
    <div class="particle" style="top:40%;left:5%;background:rgba(245,158,11,.3)"></div>
    <div class="particle" style="top:50%;left:90%;background:rgba(99,102,241,.3)"></div>
</div>
<div class="brand">⚡ GAME VAULT</div>
<div class="container">
    <div class="emoji">{template['emoji']}</div>
    <h1>{template['headline']}</h1>
    <div class="sub">Claim your FREE rewards today!<br>No deposit required — instant prizes!</div>
    <div class="btn">CLAIM NOW →</div>
    <div class="features">
        <div class="feature"><div class="feature-icon">🪙</div><div class="feature-text">50,000 Coins</div></div>
        <div class="feature"><div class="feature-icon">💵</div><div class="feature-text">$100 Cash</div></div>
        <div class="feature"><div class="feature-icon">🎰</div><div class="feature-text">Free Spins</div></div>
    </div>
    <div class="hashtags">{hashtags}</div>
</div>
<div class="date">{date_str}</div>
</body>
</html>"""
    return html

if __name__ == "__main__":
    print("=" * 55)
    print(f"📅 Date: {datetime.now().strftime('%Y-%m-%d %H:%M')}")
    print("=" * 55)
    print()
    print(generate_post())
    print()
    print("=" * 55)
    
    # Save HTML image
    html = generate_html_image()
    img_path = os.path.join(os.path.dirname(__file__), "public", "post-image.html")
    os.makedirs(os.path.dirname(img_path), exist_ok=True)
    with open(img_path, "w") as f:
        f.write(html)
    print(f"📸 Image HTML saved: {img_path}")
    print("   Open in browser → screenshot → post ke Facebook!")
    print()
    print("=" * 55)
    print("Copy text di atas, paste ke Facebook!")
