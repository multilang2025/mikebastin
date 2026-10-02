"""
Render scene illustrations for mikebastin.com (skill: scene-illustration).

    python render.py                    # every scene in scenes/
    python render.py services-hero      # one or more by name
    python render.py --sheet [names]    # preview: each scene on the cream and the navy band, png/sheet.jpg

A scene is scenes/<name>.html, a plain HTML file that links ../kit.css and
lays out cards absolutely on a transparent canvas. Its size comes from a
<meta name="size" content="800x600"> tag in CSS pixels (default 800x600), rendered at 2x with a 36px margin
all round for shadows. The output is
site/public/images/scenes/<name>.webp with an alpha channel, so the same
file sits on the cream band and the navy band in either theme.

Rendering uses the local Edge (or Chrome) headless (transparent background),
then sharp from site/node_modules for the WebP. Nothing to install.
"""
import os
import re
import subprocess
import sys
import tempfile

HERE = os.path.dirname(os.path.abspath(__file__))
SCENES = os.path.join(HERE, "scenes")
PNG = os.path.join(HERE, "png")
SITE = os.path.normpath(os.path.join(HERE, "..", "..", "site"))
OUT = os.path.join(SITE, "public", "images", "scenes")
BROWSERS = [
    r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe",
    r"C:\Program Files\Google\Chrome\Application\chrome.exe",
    "/usr/bin/google-chrome", "/usr/bin/chromium",
]


def size_of(html):
    m = re.search(r'<meta name="size" content="(\d+)x(\d+)"', html)
    return (int(m.group(1)), int(m.group(2))) if m else (800, 600)


def main(names):
    os.makedirs(PNG, exist_ok=True)
    os.makedirs(OUT, exist_ok=True)
    browser = next(p for p in BROWSERS if os.path.exists(p))
    names = names or sorted(f[:-5] for f in os.listdir(SCENES) if f.endswith(".html"))
    for n in names:
        path = os.path.join(SCENES, n + ".html")
        w, h = size_of(open(path, encoding="utf-8").read())
        png = os.path.join(PNG, n + ".png")
        subprocess.run([browser, "--headless=new", "--disable-gpu", "--hide-scrollbars", "--force-device-scale-factor=2",
                        "--default-background-color=00000000", f"--user-data-dir={tempfile.mkdtemp(prefix='scene-')}", f"--window-size={w + 72},{h + 72}", "--virtual-time-budget=4000",
                        f"--screenshot={png}", "file:///" + path.replace("\\", "/")], check=True, capture_output=True, timeout=120)
        conv = ("require('sharp')(process.argv[1]).webp({quality:88,alphaQuality:100}).toFile(process.argv[2])"
                ".then(i=>console.log(process.argv[3], i.width+'x'+i.height, i.size))")
        subprocess.run(["node", "-e", conv, png, os.path.join(OUT, n + ".webp"), n], check=True, cwd=SITE)


SHEET = """
const s=require('sharp');const [dir,out,...names]=process.argv.slice(1);
(async()=>{const tiles=[];for(const n of names){for(const bg of ['#F5F0E4','#0A1B28']){
 const img=await s(dir+'/'+n+'.webp').resize(560,440,{fit:'contain',background:{r:0,g:0,b:0,alpha:0}}).toBuffer();
 tiles.push(await s({create:{width:600,height:480,channels:4,background:bg}}).composite([{input:img,left:20,top:20}]).png().toBuffer())}}
 await s({create:{width:1200,height:480*names.length,channels:3,background:'#000'}})
  .composite(tiles.map((t,i)=>({input:t,left:(i%2)*600,top:Math.floor(i/2)*480}))).jpeg({quality:84}).toFile(out);
 console.log(out)})()
"""


def sheet(names):
    names = names or sorted(f[:-5] for f in os.listdir(OUT) if f.endswith(".webp"))
    subprocess.run(["node", "-e", SHEET, OUT, os.path.join(PNG, "sheet.jpg"), *names], check=True, cwd=SITE)


if __name__ == "__main__":
    args = sys.argv[1:]
    if args[:1] == ["--sheet"]:
        os.makedirs(PNG, exist_ok=True)
        sheet(args[1:])
    else:
        main(args)
