"""
Portfolio images for the eight project spreads (owner, 2 Oct 2026: "I need
better screenshots for the customers website. Recreate these taking
branding elements of the website").

Each image is a composition rather than a screenshot: a desktop browser and
a phone, both showing a recreated hero built from the client's own brand
elements (logo, colours, typefaces, hero photo, headline, languages), read
from the live sites on 2 Oct 2026. The source images sit in assets/.

    python gen.py            # writes html/<slug>.html and renders ../../site/public/work/<slug>.webp

Rendering uses the local Edge or Chrome in headless mode, then sharp (from
site/node_modules) for the WebP. 1600x1280 (5:4, the spread's desktop
slot); everything that matters sits inside the 4:3 crop used on mobile.
"""
import json
import os
import subprocess
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
SITE = os.path.normpath(os.path.join(HERE, "..", "..", "site"))
OUT = os.path.join(SITE, "public", "work")
HTML = os.path.join(HERE, "html")
PNG = os.path.join(HERE, "png")
W, H = 1600, 1280

BROWSERS = [
    r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe",
    r"C:\Program Files\Google\Chrome\Application\chrome.exe",
]

WHITE = "brightness(0) invert(1)"

BRANDS = [
    {
        "slug": "tx-international-freight",
        "domain": "txintlfreight.com",
        "fonts": "Poppins:wght@500;600;700&family=Karla:wght@400;500;600",
        "head": "Poppins", "body": "Karla", "h1w": 600,
        "page": ["#051650", "#0a2472"], "glow": ["#e63946", "#1a43bf"],
        "header": "transparent", "logo": "tx-logo.svg", "logoFilter": WHITE, "logoH": 40,
        "nav": ["Company", "Air", "Ocean", "Trucking", "Services"], "navColor": "#ffffff",
        "cta": {"t": "Get a Quote", "bg": "#e63946", "fg": "#fff", "r": "50px"},
        "hero": "tx-hero.webp", "overlay": "linear-gradient(180deg, rgba(10,36,114,.72), rgba(5,22,80,.82))",
        "align": "center", "h1": "The Dependable Freight Forwarder", "h1Color": "#ffffff",
        "sub": "Precision freight forwarding and project cargo expertise, from Houston to every corner of the globe.",
        "subColor": "rgba(255,255,255,.88)",
        "btn": {"t": "Get an Expert Consultant", "bg": "#e63946", "fg": "#fff", "r": "50px"},
        "phoneImg": "tx-cargo.jpg",
        "chips": ["Houston, Texas", "Air", "Ocean", "Truck"], "chipBg": "rgba(255,255,255,.12)", "chipFg": "#fff",
    },
    {
        "slug": "betranslated",
        "domain": "betranslated.com",
        "fonts": "Fraunces:opsz,wght@9..144,500;9..144,600&family=Poppins:wght@400;500;600",
        "head": "Fraunces", "body": "Poppins", "h1w": 600,
        "page": ["#1f2030", "#2f3143"], "glow": ["#f67618", "#5b5e86"],
        "header": "rgba(255,255,255,.96)", "logo": "bt-logo.avif", "logoFilter": "none", "logoH": 40,
        "nav": ["Language Services", "Interpretation", "References", "Blog", "Contact"], "navColor": "#2f3143",
        "cta": {"t": "Quote", "bg": "#f67618", "fg": "#fff", "r": "999px"},
        "hero": None, "heroBg": "#2f3143", "split": "bt-hero.webp",
        "align": "left", "h1": "Translation, Interpretation and SEO Services since 2002.", "h1Color": "#ffffff",
        "sub": "Certified on paper, and there on the day.", "subColor": "rgba(255,255,255,.82)",
        "btn": {"t": "Get a Translation Quote", "bg": "#f67618", "fg": "#fff", "r": "999px"},
        "phoneImg": "bt-hero.webp",
        "chips": [".com", ".be", ".fr", ".es", ".nl", ".co.uk"], "chipBg": "rgba(246,118,24,.16)", "chipFg": "#ffd2b0",
    },
    {
        "slug": "globaprom",
        "domain": "globaprom.com",
        "fonts": "Space+Grotesk:wght@500;700&family=Inter:wght@400;500;600",
        "head": "Space Grotesk", "body": "Inter", "h1w": 700,
        "page": ["#070c15", "#0d1522"], "glow": ["#2563eb", "#22d3ee"],
        "header": "#0d1522", "logoText": "Globaprom<span style='color:#22d3ee'>.</span>", "logoH": 40,
        "nav": ["Services", "Pricing", "How We Work", "Vibecoding", "Blog"], "navColor": "#c7d2e3",
        "cta": {"t": "Tell us what you need built", "bg": "#2563eb", "fg": "#fff", "r": "8px"},
        "hero": None, "heroBg": "#0d1522", "split": "gp-hero.webp", "splitFit": "contain",
        "align": "left", "h1": "Custom AI-Built Software for Global Teams", "h1Color": "#ffffff",
        "sub": "Software that fits your operation, multilingual from day one.", "subColor": "#a9b6cc",
        "btn": {"t": "Tell us what you need built", "bg": "#2563eb", "fg": "#fff", "r": "8px"},
        "phoneImg": "gp-hero.webp", "phoneFit": "contain", "phoneImgBg": "#0d1522",
        "chips": ["EN", "FR", "ES", "NL"], "chipBg": "rgba(34,211,238,.12)", "chipFg": "#a5f3fc",
    },
    {
        "slug": "c21perdomo",
        "domain": "c21perdomo.com",
        "fonts": "Rubik:wght@500;700&family=Inter:wght@400;500;600",
        "head": "Rubik", "body": "Inter", "h1w": 700,
        "page": ["#151516", "#252526"], "glow": ["#beaf87", "#4a4436"],
        "header": "#252526", "logo": "c21-logo.png", "logoFilter": "none", "logoH": 40,
        "nav": ["Puerto Plata", "Sosúa", "Cabarete", "Samaná", "Contact Us"], "navColor": "#e7e2d4",
        "cta": {"t": "1-809-571-2100", "bg": "#beaf87", "fg": "#252526", "r": "6px"},
        "hero": "c21-hero.webp", "overlay": "linear-gradient(180deg, rgba(37,37,38,.35), rgba(37,37,38,.78))",
        "align": "center", "h1": "Dominican Republic Real Estate: Find Your Home on the North Coast", "h1Color": "#ffffff",
        "phoneH1": "Find Your Home on the North Coast",
        "sub": None, "search": ["English", "Any location", "Any type"],
        "btn": {"t": "Search", "bg": "#beaf87", "fg": "#252526", "r": "6px"},
        "phoneImg": "c21-prop1.webp",
        "chips": ["EN", "FR", "ES", "DE"], "chipBg": "rgba(190,175,135,.16)", "chipFg": "#e7dcbd",
    },
    {
        "slug": "valenciamove",
        "domain": "valenciamove.com",
        "fonts": "DM+Serif+Display&family=Inter:wght@400;500;600",
        "head": "DM Serif Display", "body": "Inter", "h1w": 400,
        "page": ["#24180c", "#3d2a16"], "glow": ["#e89c2c", "#1a4f70"],
        "header": "rgba(255,255,255,.96)", "logo": "vm-logo.webp", "logoFilter": "none", "logoH": 52, "phoneLogoH": 38,
        "nav": ["NIE and Residency", "Beckham Law", "Neighbourhoods", "Cost of Living"], "navColor": "#3d2a16",
        "cta": {"t": "Start Your Journey", "bg": "#e89c2c", "fg": "#3d2a16", "r": "999px"},
        "hero": "vm-hero.webp", "overlay": "linear-gradient(180deg, rgba(61,42,22,.45), rgba(61,42,22,.8))",
        "align": "center", "h1": "Your move to Valencia, done right", "h1Color": "#ffffff",
        "sub": "Read the guides first. Decide later.", "subColor": "rgba(255,255,255,.9)",
        "btn": {"t": "Start Your Journey", "bg": "#e89c2c", "fg": "#3d2a16", "r": "999px"},
        "phoneImg": "vm-hero.webp",
        "chips": ["EN", "FR", "ES", "NL", "IT"], "chipBg": "rgba(232,156,44,.16)", "chipFg": "#f6d29d",
    },
    {
        "slug": "bemelman-spuiterij",
        "domain": "bemelmanspuiterij.nl",
        "fonts": "Montserrat:wght@600;700;800&family=Hind:wght@400;500;600",
        "head": "Montserrat", "body": "Hind", "h1w": 800,
        "page": ["#121417", "#22262c"], "glow": ["#ea0029", "#596277"],
        "header": "#ffffff", "logo": "bm-logo.webp", "logoFilter": "none", "logoH": 34,
        "nav": ["Home", "Diensten", "Stralen en ontlakken", "Spuiterij", "Contact"], "navColor": "#596277",
        "cta": {"t": "Offerte aanvragen", "bg": "#ea0029", "fg": "#fff", "r": "50px"},
        "hero": "bm-hero.jpg", "overlay": "linear-gradient(180deg, rgba(10,0,0,.55), rgba(10,0,0,.72))",
        "align": "center", "h1": "BEMELMAN SPUITERIJ", "h1Color": "#ffffff",
        "sub": "Spuiterij en poedercoaten sinds 1976", "subColor": "rgba(255,255,255,.9)",
        "btn": {"t": "Onze Diensten", "bg": "#ea0029", "fg": "#fff", "r": "50px"},
        "phoneImg": "bm-hero.jpg",
        "chips": ["Noordwijkerhout", "NL", "ISO 9001"], "chipBg": "rgba(234,0,41,.16)", "chipFg": "#ffb3c0",
    },
    {
        "slug": "delaguia-y-luzon",
        "domain": "delaguialuzon.com",
        "fonts": "Ysabeau+Office:wght@400;500;600",
        "head": "Ysabeau Office", "body": "Ysabeau Office", "h1w": 500,
        "page": ["#dfe3dd", "#f3f3f1"], "glow": ["#718472", "#b5bfb5"], "light": True,
        "header": "#ffffff", "logo": "dl-logo.webp", "logoFilter": "none", "logoH": 40,
        "nav": ["Áreas de especialización", "Quiénes somos", "Blog", "Contacto", "ES"], "navColor": "#6b6f73",
        "cta": None,
        "hero": "dl-hero.webp", "overlay": "linear-gradient(180deg, rgba(255,255,255,.72), rgba(255,255,255,.82))",
        "align": "center", "h1": "Somos su despacho de abogados en Valencia", "h1Color": "#1a1f24",
        "sub": "Especialista en asuntos legales que le acompaña desde hace 65 años.", "subColor": "#718472",
        "btn": {"t": "Contáctanos", "bg": "transparent", "fg": "#1a1f24", "r": "2px", "bd": "2px solid #1a1f24"},
        "phoneImg": "dl-hero.webp",
        "chips": ["Español", "Français", "English", "Русский"], "chipBg": "rgba(113,132,114,.14)", "chipFg": "#4f5f50",
    },
    {
        "slug": "matosurf",
        "domain": "matosurf.com",
        "fonts": "Epilogue:wght@800;900&family=Plus+Jakarta+Sans:wght@400;500;600",
        "head": "Epilogue", "body": "Plus Jakarta Sans", "h1w": 900,
        "page": ["#06262d", "#0b1519"], "glow": ["#0d8095", "#2fc6d6"],
        "header": "transparent", "logo": "ms-logo-white.png", "logoFilter": "none", "logoH": 38,
        "nav": ["Surf", "Kitesurf", "Paddle", "Windsurf", "Foil", "Destinations"], "navColor": "#ffffff",
        "cta": {"t": "Trouver un spot", "bg": "#0d8095", "fg": "#fff", "r": "12px"},
        "hero": "ms-hero.webp", "overlay": "linear-gradient(180deg, rgba(11,21,25,.25), rgba(11,21,25,.7))",
        "align": "left", "h1": "Surf, kitesurf et paddle : dominez les vagues", "h1Color": "#ffffff",
        "sub": "7 sports de glisse, 48 spots français, plus de 120 guides.", "subColor": "rgba(255,255,255,.9)",
        "btn": {"t": "Explorer les spots", "bg": "#0d8095", "fg": "#fff", "r": "9999px"},
        "phoneImg": "ms-wind.webp",
        "chips": ["FR", "EN", "ES", "NL"], "chipBg": "rgba(13,128,149,.22)", "chipFg": "#9be7f0",
    },
]


def esc(s):
    return s.replace("&", "&amp;").replace("<", "&lt;") if s else s


def logo_html(b, h=None):
    h = h or b["logoH"]
    if b.get("logoText"):
        return f"<span class='logotext' style='font-size:{h * 0.8}px'>{b['logoText']}</span>"
    return f"<img src='../assets/{b['logo']}' style='height:{h}px;filter:{b.get('logoFilter', 'none')}' alt=''>"


def button(btn, size=1.0):
    if not btn:
        return ""
    bd = btn.get("bd", "none")
    return (f"<span class='btn' style='background:{btn['bg']};color:{btn['fg']};border-radius:{btn['r']};"
            f"border:{bd};font-size:{17 * size}px;padding:{14 * size}px {28 * size}px'>{esc(btn['t'])}</span>")


def hero_html(b, phone=False):
    h1size = 30 if phone else (60 if len(b["h1"]) < 40 else 50)
    align = "center" if (b["align"] == "center" or phone) else "left"
    text = b.get('phoneH1', b['h1']) if phone else b['h1']
    parts = [f"<h1 style='font-size:{h1size}px;color:{b['h1Color']};text-align:{align}'>{esc(text)}</h1>"]
    if b.get("sub"):
        parts.append(f"<p class='sub' style='color:{b['subColor']};text-align:{align};font-size:{15 if phone else 20}px'>{esc(b['sub'])}</p>")
    if b.get("search") and not phone:
        cells = "".join(f"<span class='cell'>{esc(c)}</span>" for c in b["search"])
        parts.append(f"<div class='search'>{cells}{button(b['btn'], 0.95)}</div>")
    else:
        parts.append(f"<div style='text-align:{align}'>{button(b['btn'], 0.8 if phone else 1)}</div>")
    return "".join(parts)


def page(b):
    light = b.get("light")
    frame = "#ffffff" if not light else "#ffffff"
    bar = "#1c1f26" if not light else "#e6e8e4"
    url_bg = "#2b2f38" if not light else "#ffffff"
    url_fg = "#aab1bf" if not light else "#6b6f73"
    nav = "".join(f"<span>{esc(n)}</span>" for n in b["nav"])
    cta = button(b["cta"], 0.82) if b.get("cta") else ""
    if b.get("hero"):
        hero_bg = f"background:{b['overlay']}, url('../assets/{b['hero']}') center/cover"
        inner = f"<div class='herocopy {b['align']}'>{hero_html(b)}</div>"
    else:
        fit = b.get("splitFit", "cover")
        hero_bg = f"background:{b['heroBg']}"
        inner = (f"<div class='split'><div class='herocopy left'>{hero_html(b)}</div>"
                 f"<div class='splitimg' style=\"background:url('../assets/{b['split']}') center/{fit} no-repeat\"></div></div>")
    header_overlay = b["header"] == "transparent"
    chips = "".join(f"<span class='chip' style='background:{b['chipBg']};color:{b['chipFg']}'>{esc(c)}</span>" for c in b["chips"])
    pfit = b.get("phoneFit", "cover")
    pbg = b.get("phoneImgBg", "#000")
    phone_header_bg = b["header"] if not header_overlay else b["page"][1]
    return f"""<!doctype html><html><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family={b['fonts']}&display=block" rel="stylesheet">
<style>
*{{box-sizing:border-box;margin:0;padding:0}}
html,body{{width:{W}px;height:{H}px;overflow:hidden}}
body{{font-family:'{b['body']}',sans-serif;background:radial-gradient(1200px 800px at 15% 10%, {b['glow'][0]}33, transparent 60%),
 radial-gradient(900px 700px at 95% 95%, {b['glow'][1]}40, transparent 60%), linear-gradient(160deg,{b['page'][0]},{b['page'][1]});position:relative}}
body:after{{content:'';position:absolute;inset:0;background-image:radial-gradient({'#00000014' if light else '#ffffff10'} 1.2px, transparent 1.2px);background-size:26px 26px;pointer-events:none}}
.win{{position:absolute;left:80px;top:150px;width:1210px;height:840px;border-radius:16px;overflow:hidden;background:{frame};
 box-shadow:0 40px 90px rgba(0,0,0,{.18 if light else .5}),0 0 0 1px rgba(255,255,255,.06);z-index:2}}
.bar{{height:46px;background:{bar};display:flex;align-items:center;padding:0 18px;gap:9px}}
.dot{{width:13px;height:13px;border-radius:50%}}
.url{{margin-left:24px;flex:1;max-width:560px;height:28px;border-radius:8px;background:{url_bg};color:{url_fg};font:500 14px/28px 'Inter',sans-serif;padding:0 14px}}
.site{{position:absolute;top:46px;left:0;right:0;bottom:0;{hero_bg}}}
header{{height:84px;display:flex;align-items:center;justify-content:space-between;padding:0 44px;background:{b['header']};position:relative;z-index:2}}
header .nav{{display:flex;gap:30px;font-family:'{b['body']}';font-weight:500;font-size:16px;color:{b['navColor']}}}
.logotext{{font-family:'{b['head']}';font-weight:700;color:#fff;letter-spacing:-.5px}}
.btn{{display:inline-block;font-family:'{b['body']}';font-weight:600;white-space:nowrap}}
.herocopy{{position:absolute;left:0;right:0;top:84px;bottom:0;display:flex;flex-direction:column;justify-content:center;gap:26px;padding:0 90px}}
.herocopy.center{{align-items:center;padding:0 140px}}
.split{{position:absolute;inset:84px 0 0 0;display:grid;grid-template-columns:1.1fr 1fr}}
.split .herocopy{{position:relative;top:0;padding:0 40px 0 70px}}
.splitimg{{margin:40px 40px 40px 0;border-radius:18px}}
h1{{font-family:'{b['head']}';font-weight:{b['h1w']};line-height:1.08;letter-spacing:-.5px}}
.sub{{max-width:760px;line-height:1.5;font-family:'{b['body']}'}}
.search{{display:flex;gap:10px;background:rgba(255,255,255,.96);padding:10px;border-radius:10px;align-items:center}}
.search .cell{{padding:12px 22px;border-radius:6px;background:#fff;border:1px solid #e3e1da;color:#252526;font:500 16px 'Inter'}}
.phone{{position:absolute;right:92px;top:372px;width:332px;height:690px;border-radius:48px;background:#0b0b0f;padding:12px;z-index:3;
 box-shadow:0 40px 90px rgba(0,0,0,.55),0 0 0 2px rgba(255,255,255,.08)}}
.screen{{width:100%;height:100%;border-radius:38px;overflow:hidden;background:{b.get('heroBg', b['page'][1])};position:relative;display:flex;flex-direction:column}}
.notch{{position:absolute;top:10px;left:50%;transform:translateX(-50%);width:96px;height:26px;border-radius:14px;background:#0b0b0f;z-index:5}}
.pbar{{height:74px;padding:30px 20px 0;display:flex;align-items:center;justify-content:space-between;background:{phone_header_bg}}}
.burger{{width:22px;height:14px;border-top:2.5px solid {b['navColor'] if not header_overlay else '#fff'};border-bottom:2.5px solid {b['navColor'] if not header_overlay else '#fff'};position:relative}}
.pimg{{height:270px;background:{pbg} url('../assets/{b['phoneImg']}') center/{pfit} no-repeat}}
.pcopy{{flex:1;padding:24px 22px;display:flex;flex-direction:column;gap:16px;justify-content:center;background:{b['page'][1] if not light else '#ffffff'}}}
.pcopy h1{{font-size:28px!important}}
.chips{{position:absolute;left:80px;top:1030px;display:flex;gap:12px;z-index:3}}
.chip{{font:600 18px 'Inter',sans-serif;padding:11px 20px;border-radius:999px;letter-spacing:.2px}}
.domain{{position:absolute;left:80px;top:1100px;font:500 20px 'Inter',sans-serif;color:{'#4f5f50' if light else 'rgba(255,255,255,.62)'};z-index:3}}
</style></head><body>
<div class="win"><div class="bar"><span class="dot" style="background:#ff5f57"></span><span class="dot" style="background:#febc2e"></span><span class="dot" style="background:#28c840"></span><span class="url">https://{b['domain']}</span></div>
<div class="site"><header>{logo_html(b)}<div class="nav">{nav}</div>{cta}</header>{inner}</div></div>
<div class="phone"><div class="screen"><span class="notch"></span><div class="pbar">{logo_html(b, b.get('phoneLogoH', 26))}<span class="burger"></span></div>
<div class="pimg"></div><div class="pcopy">{hero_html(b, phone=True)}</div></div></div>
<div class="chips">{chips}</div><div class="domain">{b['domain']}</div>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@500;600&display=block" rel="stylesheet">
</body></html>"""


def main(only=None):
    os.makedirs(HTML, exist_ok=True)
    os.makedirs(PNG, exist_ok=True)
    browser = next(p for p in BROWSERS if os.path.exists(p))
    done = []
    for b in BRANDS:
        if only and b["slug"] not in only:
            continue
        hp = os.path.join(HTML, b["slug"] + ".html")
        open(hp, "w", encoding="utf-8").write(page(b))
        png = os.path.join(PNG, b["slug"] + ".png")
        subprocess.run([browser, "--headless=new", "--disable-gpu", "--hide-scrollbars", "--force-device-scale-factor=1",
                        f"--window-size={W},{H}", "--virtual-time-budget=8000", f"--screenshot={png}",
                        "file:///" + hp.replace("\\", "/")], check=True, capture_output=True)
        done.append(b["slug"])
    conv = ("const s=require('sharp');const [png,out,list]=[process.argv[1],process.argv[2],process.argv[3].split(',')];"
            "Promise.all(list.map(n=>s(png+'/'+n+'.png').resize(1600,1280).webp({quality:84}).toFile(out+'/'+n+'.webp')))"
            ".then(r=>r.forEach((i,k)=>console.log(list[k],i.width+'x'+i.height,i.size)))")
    subprocess.run(["node", "-e", conv, PNG, OUT, ",".join(done)], check=True, cwd=SITE)


if __name__ == "__main__":
    main(sys.argv[1:] or None)
