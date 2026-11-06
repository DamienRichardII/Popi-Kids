"""Retouche en lot avec l'API OpenAI Images (edit).
Usage (PowerShell, une commande par ligne) :
  pip install openai
  $env:OPENAI_API_KEY="sk-..."     # ne jamais coller la clé dans un chat ni la committer
  python run.py --essai 3          # 3 photos pour valider le rendu
  python run.py                    # tout le catalogue
Variables : MODEL (defaut gpt-image-1 ; mettre le nom exact du modèle "GPT Image 2" de votre compte)."""
import csv, os, sys, base64, pathlib
from openai import OpenAI
HERE = pathlib.Path(__file__).parent
ROOT = HERE.parent / "assets"            # dossier source des photos fournisseur
LOGO = HERE / "logo.png"                 # logo POPI KIDS (fond transparent)
OUT = HERE / "sorties"; OUT.mkdir(exist_ok=True)
MODEL = os.environ.get("MODEL", "gpt-image-1")
prompt = (HERE / "prompt.txt").read_text(encoding="utf-8")
client = OpenAI()
rows = list(csv.DictReader(open(HERE / "manifest.csv", encoding="utf-8")))
if "--essai" in sys.argv: rows = rows[: int(sys.argv[sys.argv.index("--essai") + 1])]
for r in rows:
    dst = OUT / f"prod-{r['slug']}-1.png"
    if dst.exists(): continue
    src = next(ROOT.rglob(r["source"]), None)
    if not src: print("introuvable", r["source"]); continue
    g = r["vetement"]
    if r["logo"] == "non":
        p = prompt.split("4. Logo")[0] + "4. No logo on the clothes.\n5. Realistic studio lighting, natural skin. No text, no watermark.".replace("{GARMENT}", g)
        p = p.replace("{GARMENT}", "clothes")
        files = [open(src, "rb")]
    else:
        rule = ("This is a polo: place the logo on the chest on the heart side, clearly away from the button placket, never on the buttons." if "polo" in g else "")
        p = prompt.replace("{GARMENT}", g).replace("{POLO_RULE}", rule)
        files = [open(src, "rb"), open(LOGO, "rb")]
    res = client.images.edit(model=MODEL, image=files, prompt=p, size="1024x1536")
    dst.write_bytes(base64.b64decode(res.data[0].b64_json)); print("ok", r["slug"])
