import re, urllib.request
url = "https://maulikhospitality.com/weddings"
req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"})
html = urllib.request.urlopen(req, timeout=25).read().decode("utf-8", "ignore")
print("len=", len(html))
imgs = sorted(set(re.findall(r'https?://[^"\s<>]+\.(?:jpe?g|webp|png)', html)))
imgs = [u for u in imgs if not any(k in u.lower() for k in ["logo", "icon", "favicon", "elementor", "sprite"])]
for u in imgs[:30]:
    print(" ", u[:180])
