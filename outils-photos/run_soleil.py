"""Photos PORTEES style LIFESTYLE : cour en pierre claire ensoleillee (reference : photos du chef de projet), vetements uniquement.
  Meme script que run_soleil.py, seul le decor / la pose / le cadrage changent.
  $env:OPENAI_API_KEY="sk-..."   ;   $env:MODEL="gpt-image-2"
  python run_soleil.py --pilot                      (essai : aida, monzha, urban, nepal, andre)
  python run_soleil.py --only aida,forza,calcio     (essai)
  python run_soleil.py                               (tout, ~83 images, ~3,5 $)
Sorties : sorties_soleil\\prod-<slug>-1.png (relancer ignore celles deja faites)."""
import csv, os, sys, base64, pathlib
from openai import OpenAI
HERE = pathlib.Path(__file__).parent
ROOTS = [(HERE.parent / "assets").resolve(), (HERE.parent / "public" / "assets").resolve()]
LOGO = HERE / "logo.png"
OUT = HERE / "sorties_soleil"; OUT.mkdir(exist_ok=True)
MODEL = os.environ.get("MODEL", "gpt-image-2")

# Meme univers pour tous : cour en pierre dorée ensoleillée, variantes d'arriere-plan pour eviter la repetition.
SCENES = ["an old sunlit honey-coloured limestone courtyard wall with a tall arched window, a few olive-tree leaves softly blurred in a corner",
 "a sunlit honey-coloured limestone wall with a stone archway, an olive tree softly blurred on one side",
 "a sunlit honey-coloured limestone building with a small arched window and an olive branch softly blurred in the top corner",
 "a sunlit limestone courtyard with a stone bench and soft blurred olive trees, pale cobblestone ground"]

LOGOTXT = {
 "top": ("Add the brand logo: an embroidered 'POPI KIDS' mark (use the second image as the exact reference, do not redraw or alter the letters) "
         "on the wearer's LEFT chest, which is the RIGHT side of the image, at heart height. Clearly visible and legible, about 7 cm wide in real life, "
         "navy blue (#1B2A4A) on light fabric, white on dark fabric, following the fabric folds like real embroidery. {POLO}"),
 "bottom": ("Add the brand logo: a small embroidered 'POPI KIDS' mark (use the second image as the exact reference, do not redraw or alter the letters) "
         "on the front of the wearer's LEFT leg of the shorts/trousers (right side of the image), a hand-width below the waistband, about 5 cm wide, "
         "clearly visible and legible, high contrast with the fabric. The top the child wears stays plain."),
 "cap": ("Add the brand logo: a small embroidered 'POPI KIDS' mark (use the second image as the exact reference) centred on the front panel of the cap, "
         "about 4 cm wide, clearly legible, high contrast."),
}
BASE = ("Edit the first image into a premium e-commerce lifestyle photo of a child wearing {G}. "
 "KEEP EXACTLY THE SAME: the {G} (colour, fabric, cut, print, piping, collar, zip, panels), the child's face, hair, skin tone and identity. "
 "{FLAT}"
 "BACKGROUND: replace any backdrop, props or scenery with {D}. Warm natural afternoon sunlight, soft golden tones, shallow depth of field so the background is gently blurred, "
 "the garment is the hero: true colours, sharp fabric texture. Same look for every photo of the collection. "
 "POSE: natural and joyful, a genuine smile, relaxed body (one hand in a pocket, walking slowly, or sitting on a stone), looking at or near the camera. "
 "The garment must stay fully visible and not hidden by arms. "
 "FRAMING: vertical 4:5 portrait, {F}, child slightly off-centre. The whole head and hair must be fully inside the frame with clear space above it, never cropped. "
 "{L} "
 "Realistic light, natural skin, no plastic look. No other logo, no text, no watermark, no extra person.")

items = []
for r in csv.DictReader(open(HERE / "manifest.csv", encoding="utf-8")):
    v = r["vetement"]; k = "bottom" if v == "bottoms" else "top"
    items.append(dict(slug=r["slug"], src=r["source"], g=v if v != "bottoms" else "the shorts / trousers / skirt shown",
        k=k, flat="", f="head to mid-thigh" if k == "top" else "full body from head to feet, the lower garment fully visible", cold=v in
        ("padded jacket", "jacket", "zip track jacket", "fleece top", "sweatshirt")))
FLAT = ("The first image is a product photo without a child: create a child (aged 6 to 10) wearing exactly this product, "
        "with plain white or neutral clothes elsewhere. ")
for s, f, g, k, fr in [("calcio","prod-calcio-1.jpg","football shorts","bottom","full body from head to feet"),
    ("player","prod-player-1.jpg","football shorts","bottom","full body from head to feet"),
    ("gladius","prod-gladius-1.jpg","zipped tracksuit jacket","top","head to mid-thigh"),
    ("freya","prod-freya-1.jpg","baseball cap","cap","head and shoulders to chest, face fully visible"),
    ("uranus","prod-uranus-1.jpg","baseball cap","cap","head and shoulders to chest, face fully visible"),
    ("panel","prod-panel-1.jpg","baseball cap","cap","head and shoulders to chest, face fully visible")]:
    items.append(dict(slug=s, src=f, g=g, k=k, flat=FLAT, f=fr, cold=False))

only = sys.argv[sys.argv.index("--only") + 1].split(",") if "--only" in sys.argv else None
if "--pilot" in sys.argv: only = ["aida", "monzha", "urban", "nepal", "andre"]
c = OpenAI(); n = {"calm": 0, "cold": 0, "sport": 0}
for it in items:
    s = it["slug"]
    d = SCENES[n["calm"] % len(SCENES)]; n["calm"] += 1; kind = "soleil"
    if only and s not in only: continue
    dst = OUT / f"prod-{s}-1.png"
    if dst.exists(): continue
    src = next((p for R in ROOTS for p in [next(R.rglob(it["src"]), None)] if p), None)
    if not src: print("introuvable", it["src"]); continue
    polo = "This is a polo: put the logo on the chest on the heart side, clearly away from the button placket, never on the buttons." if "polo" in it["g"] else ""
    p = BASE.format(G=it["g"], FLAT=it["flat"], D=d, F=it["f"], L=LOGOTXT[it["k"]].replace("{POLO}", polo))
    res = c.images.edit(model=MODEL, image=[open(src, "rb"), open(LOGO, "rb")], prompt=p, size="1024x1536")
    dst.write_bytes(base64.b64decode(res.data[0].b64_json)); print("ok", s, "-", kind)
