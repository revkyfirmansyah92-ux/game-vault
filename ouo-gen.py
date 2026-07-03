#!/usr/bin/env python3
"""
Game Vault — OUO.io Shortlink Generator
Generate clean shortlinks untuk semua halaman Game Vault.
"""

import json
import urllib.request
import urllib.parse

OUO_API = "8piJPRhY"
BASE_URL = "https://freegamevault.web.id"

PAGES = {
    "Homepage": BASE_URL,
    "Register": f"{BASE_URL}?ref=reg",
    "Spin Wheel": f"{BASE_URL}?ref=spin",
    "Claim Prize": f"{BASE_URL}?ref=claim",
}

def shorten(url):
    try:
        api_url = f"https://ouo.io/api/{OUO_API}?s={urllib.parse.quote(url)}"
        req = urllib.request.Request(api_url, headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(req, timeout=15) as resp:
            result = resp.read().decode().strip()
            if result.startswith("http"):
                return result
            return f"ERROR: {result}"
    except Exception as e:
        return f"ERROR: {e}"

print("=" * 55)
print("🔗 Game Vault — OUO.io Shortlinks")
print("=" * 55)
print()

for name, url in PAGES.items():
    short = shorten(url)
    print(f"📌 {name}")
    print(f"   Short: {short}")
    print()

print("=" * 55)
print("📱 Main Link to Share:")
print("=" * 55)
main = shorten(BASE_URL)
print(f"\n👉 {main}\n")
