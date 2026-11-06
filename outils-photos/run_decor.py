"""Photos PORTEES en vrai decor (ambiance lifestyle), logo POPI KIDS visible sur chaque article.
  $env:OPENAI_API_KEY="sk-..."   ;   $env:MODEL="gpt-image-2"
  python run_decor.py --only aida,forza,calcio     (essai)
  python run_decor.py                               (tout, ~83 images, ~3,5 $)
Sorties : sorties_decor\\prod-<slug>-1.png (relancer ignore celles deja faites)."""
import csv, os, sys, base64, pathlib
from openai import OpenAI
HERE = pathlib.Path(__file__).parent
ROOTS = [(HERE.parent / "assets").resolve(), (HERE.parent / "public" / "assets").resolve()]
LOGO = HERE / "logo.png"
OUT = HERE / "sorties_decor"; OUT.mkdir(exist_ok=True)
MODEL = os.environ.get("MODEL", "gpt-image-2")

CALM = ["sunlit bright living room with green plants and a light wooden shelf, soft window light",
 "calm Parisian street with cream stone buildings and soft blurred shopfronts, daylight",
 "public park with green trees and soft golden-hour light, blurred foliage",
 "school courtyard with a warm brick wall and a few blurred benches, soft daylight",
 "flower garden terrace with pastel flowers and a white fence, blurred, morning light",
 "cosy pastel bedroom with a window, curtains and wooden furniture, soft natural light",
 "bright bookshop with warm wooden shelves of books, blurred, soft light",
 "sunny cafe terrace with rattan chairs and plants, blurred, warm light",
 "sandy beach dune with soft pastel sky and sea grass, blurred, late afternoon light"]
COLD = ["autumn park with orange and golden leaves and a soft blurred path, cool daylight",
 "snowy mountain village with wooden chalets and pine trees, blurred, soft winter light",
 "misty forest path with warm autumn colours, blurred, soft light",
 "quiet city street in autumn with blurred warm shop lights, late afternoon"]
SPORT = ["sunny football pitch with green turf, white lines and blurred goal behind, golden light",
 "outdoor athletics track with blurred stands, bright morning light",
 "school sports field with green grass and blurred trees, daylight"]
SPORTW = ("dortmund celtic bayern arsenal roma soccer sport forza racing united calcio player argos new-astun "
          "neapolis coria rodas urus better benoit agia nelly carla leire adelpho").split()

LOGOTXT = {
 "top": ("Add the brand logo: an embroidered 'POPI KIDS' mark (use the second image as the exact reference, do not redraw or alter the letters) "
         "on the wearer's LEFT chest, which is the RIGHT side of the image, at heart height. Clearly visible and legible, about 7 cm wide in real life, "
         "high contrast (dark navy on light fabric, white on dark fabric), following the fabric folds like real embroidery. {POLO}"),
 "bottom": ("Add the brand logo: a small embroidered 'POPI KIDS' mark (use the second image as the exact reference, do not redraw or alter the letters) "
         "on the front of the wearer's LEFT leg of the shorts/trousers (right side of the image), a hand-width below the waistband, about 5 cm wide, "
         "clearly visible and legible, high contrast with the fabric. The top the child wears stays plain."),
 "cap": ("Add the brand logo: a small embroidered 'POPI KIDS' mark (use the second image as the exact reference) centred on the front panel of the cap, "
         "about 4 cm wide, clearly legible, high contrast."),
}
BASE = ("Edit the first image into a premium e-commerce lifestyle photo of a child wearing {G}. "
 "KEEP EXACTLY THE SAME: the {G} (colour, fabric, cut, print, piping, collar, zip, panels), the child's face, hair, skin tone and identity. "
 "{FLAT}"
 "SETTING: replace any studio backdrop with a real, believable place: {D}. The place is softly blurred (shallow depth of field) so the garment stays the hero; "
 "natural light, real atmosphere, nothing distracting, no text or signs readable. "
 "POSE: calm and natural, standing or sitting still, looking at the camera, relaxed arms. If the original pose is a jump, kick, dance or strong movement, make it a simple still pose. "
 "FRAMING: vertical portrait, {F}, child centred. "
 "{L} "
 "Realistic light, natural skin, sharp fabric texture. No other logo, no watermark, no extra person.")

items = []
for r in csv.DictReader(open(HERE / "manifest.csv", encoding="utf-8")):
    v = r["vetement"]; k = "bottom" if v == "bottoms" else "top"
    items.append(dict(slug=r["slug"], src=r["source"], g=v if v != "bottoms" else "the shorts / trousers / skirt shown",
        k=k, flat="", f="upper body to mid-thigh" if k == "top" else "from chest to feet, the lower garment fully visible", cold=v in
        ("padded jacket", "jacket", "zip track jacket", "fleece top", "sweatshirt")))
FLAT = ("The first image is a product photo without a child: create a child (aged 6 to 10) wearing exactly this product, "
        "with plain white or neutral clothes elsewhere. ")
for s, f, g, k, fr in [("calcio","prod-calcio-1.jpg","football shorts","bottom","from chest to feet"),
    ("player","prod-player-1.jpg","football shorts","bottom","from chest to feet"),
    ("gladius","prod-gladius-1.jpg","zipped tracksuit jacket","top","upper body to mid-thigh"),
    ("freya","prod-freya-1.jpg","baseball cap","cap","head and shoulders to chest"),
    ("uranus","prod-uranus-1.jpg","baseball cap","cap","head and shoulders to chest"),
    ("panel","prod-panel-1.jpg","baseball cap","cap","head and shoulders to chest")]:
    items.append(dict(slug=s, src=f, g=g, k=k, flat=FLAT, f=fr, cold=False))

only = sys.argv[sys.argv.index("--only") + 1].split(",") if "--only" in sys.argv else None
c = OpenAI(); n = {"calm": 0, "cold": 0, "sport": 0}
for it in items:
    s = it["slug"]
    if it["cold"]: kind, pool = "cold", COLD
    elif s in SPORTW: kind, pool = "sport", SPORT
    else: kind, pool = "calm", CALM
    d = pool[n[kind] % len(pool)]; n[kind] += 1
    if only and s not in only: continue
    dst = OUT / f"prod-{s}-1.png"
    if dst.exists(): continue
    src = next((p for R in ROOTS for p in [next(R.rglob(it["src"]), None)] if p), None)
    if not src: print("introuvable", it["src"]); continue
    polo = "This is a polo: put the logo on the chest on the heart side, clearly away from the button placket, never on the buttons." if "polo" in it["g"] else ""
    p = BASE.format(G=it["g"], FLAT=it["flat"], D=d, F=it["f"], L=LOGOTXT[it["k"]].replace("{POLO}", polo))
    res = c.images.edit(model=MODEL, image=[open(src, "rb"), open(LOGO, "rb")], prompt=p, size="1024x1536")
    dst.write_bytes(base64.b64decode(res.data[0].b64_json)); print("ok", s, "-", kind)
