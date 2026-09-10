import re, urllib.request
url = "https://maulikhospitality.com/weddings"
req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"})
html = urllib.request.urlopen(req, timeout=25).read().decode("utf-8", "ignore")
pats = [
    r'data-src="([^"]+)"',
    r'data-lazy-src="([^"]+)"',
    r'srcset="([^"]+)"',
    r'background-image:\s*url\(([^)]+)\)',
    r'url\(["\']?(https://maulikhospitality\.com[^"\')]+)["\']?\)',
]
seen = set()
for pat in pats:
    for m in re.findall(pat, html):
        for u in m.split(","):
            u = u.strip().split(" ")[0].strip("\"'")
            if u.startswith("http") and not any(k in u.lower() for k in ["logo", "icon", "elementor"]) and u not in seen:
                seen.add(u)
                print(u[:180])
print("total", len(seen))
