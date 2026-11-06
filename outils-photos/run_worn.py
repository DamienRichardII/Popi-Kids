"""Génère des photos PORTÉES pour les articles qui n'ont que des photos produit (shorts, vestes, casquettes).
  python run_worn.py          (clé: $env:OPENAI_API_KEY, MODEL=gpt-image-2)"""
import os, base64, pathlib
from openai import OpenAI
HERE = pathlib.Path(__file__).parent
ROOT = HERE.parent / "public" / "assets"
OUT = HERE / "sorties"; OUT.mkdir(exist_ok=True)
MODEL = os.environ.get("MODEL", "gpt-image-2")
BASE = ("Create a professional kidswear catalogue photo of a real child wearing the exact product shown in the image "
 "({P}). Keep the product IDENTICAL (colour, fabric, cut, stripes, piping, zip, panels, seams): do not redesign or recolour it. "
 "{O} Child aged 6 to 10, calm natural still pose, looking at the camera, arms relaxed, friendly neutral expression. "
 "Vertical 4:5 portrait, {F}, child centred. Clean plain studio backdrop, {B}, soft light gradient, no objects, no floor lines. "
 "Realistic studio lighting, natural skin and hair, sharp fabric texture. No text, no watermark, no logo, no extra person.")
ITEMS = [
 ("calcio","prod-calcio-1.jpg","football shorts","The child wears a plain white short-sleeve t-shirt and white socks with the shorts.","from waist to feet, full legs visible","soft sage green (#CFD8C6)"),
 ("player","prod-player-1.jpg","football shorts","The child wears a plain white short-sleeve t-shirt and white socks with the shorts.","from waist to feet, full legs visible","powder blue (#CFDDE6)"),
 ("gladius","prod-gladius-1.jpg","zipped tracksuit jacket","The child wears it zipped halfway over a plain white t-shirt, dark simple trousers. Embroidered small 'POPI KIDS' wordmark is NOT needed.","upper body to mid-thigh","blush pink (#EBCFC6)"),
 ("freya","prod-freya-1.jpg","baseball cap","The child wears the cap on the head, straight, with a plain white t-shirt.","head and shoulders to chest","warm cream (#F1E6D3)"),
 ("uranus","prod-uranus-1.jpg","baseball cap","The child wears the cap on the head, straight, with a plain navy t-shirt.","head and shoulders to chest","light lavender (#D9D3E3)"),
 ("panel","prod-panel-1.jpg","baseball cap","The child wears the cap on the head, straight, with a plain light-blue t-shirt.","head and shoulders to chest","warm peach (#E9D3BF)"),
]
c = OpenAI()
for s, f, p, o, fr, b in ITEMS:
    dst = OUT / f"prod-{s}-1.png"
    if dst.exists(): continue
    src = next(ROOT.rglob(f), None)
    if not src: print("introuvable", f); continue
    r = c.images.edit(model=MODEL, image=[open(src,"rb")], prompt=BASE.format(P=p,O=o,F=fr,B=b), size="1024x1536")
    dst.write_bytes(base64.b64decode(r.data[0].b64_json)); print("ok", s)
