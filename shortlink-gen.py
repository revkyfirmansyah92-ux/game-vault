#!/usr/bin/env python3
"""
Game Vault — Shortlink Generator
Generate ShrinkMe shortlinks untuk semua halaman Game Vault.
"""

import json
import urllib.request
import urllib.parse

API_KEY = "61e827e6bc9876f61d7c3339086a6b652848c05b"
BASE_URL = "https://freegamevault.web.id"

# Pages to shorten
PAGES = {
    "Homepage": f"{BASE_URL}",
    "Register": f"{BASE_URL}?ref=reg",
    "Spin Wheel": f"{BASE_URL}?ref=spin",
    "Claim Prize": f"{BASE_URL}?ref=claim",
}

def shorten(url):
    """Shorten URL via ShrinkMe API."""
    api_url = f"https://shrinkme.io/api?api={API_KEY}&url={urllib.parse.quote(url)}"
    try:
        req = urllib.request.Request(api_url, headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(req, timeout=15) as resp:
            data = json.loads(resp.read().decode())
            if data.get("status") == "success":
                return data.get("shortenedUrl", "FAILED")
            return f"ERROR: {data.get('message', 'unknown')}"
    except Exception as e:
        return f"ERROR: {e}"

def generate_all():
    """Generate shortlinks for all pages."""
    print("=" * 55)
    print("🔗 Game Vault — ShrinkMe Shortlinks")
    print("=" * 55)
    print()

    links = {}
    for name, url in PAGES.items():
        short = shorten(url)
        links[name] = short
        print(f"📌 {name}")
        print(f"   Original: {url}")
        print(f"   Short:    {short}")
        print()

    # Generate share links
    print("=" * 55)
    print("📱 Share Links (Copy & Paste)")
    print("=" * 55)
    print()

    # Facebook
    print("📘 Facebook:")
    for name, link in links.items():
        share_url = f"https://www.facebook.com/sharer/sharer.php?u={urllib.parse.quote(link)}"
        print(f"   {name}: {share_url}")
    print()

    # Twitter
    print("🐦 Twitter:")
    for name, link in links.items():
        tweet = f"🎰 FREE SPIN & WIN! {link}"
        share_url = f"https://twitter.com/intent/tweet?text={urllib.parse.quote(tweet)}"
        print(f"   {name}: {share_url}")
    print()

    # WhatsApp
    print("💬 WhatsApp:")
    for name, link in links.items():
        wa_text = f"🎁 Claim FREE rewards! Spin & Win! {link}"
        share_url = f"https://wa.me/?text={urllib.parse.quote(wa_text)}"
        print(f"   {name}: {share_url}")
    print()

    return links

if __name__ == "__main__":
    generate_all()
