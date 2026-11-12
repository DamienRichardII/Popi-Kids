"""Telecharge le catalogue reel de popikids.com (API publique WooCommerce Store) vers data/woo-products.json.
  python sync_catalogue.py            (a lancer depuis outils-photos, aucun identifiant requis)"""
import json, pathlib, urllib.request
OUT = pathlib.Path(__file__).parent.parent / "data" / "woo-products.json"
OUT.parent.mkdir(exist_ok=True)
rows, page = [], 1
while True:
    req = urllib.request.Request(f"https://popikids.com/wp-json/wc/store/v1/products?per_page=100&page={page}", headers={"User-Agent": "popikids-sync"})
    with urllib.request.urlopen(req, timeout=60) as r:
        data = json.load(r)
    if not data: break
    for p in data:
        rows.append({"id": p["id"], "slug": p["slug"], "name": p["name"], "sku": p.get("sku"), "type": p.get("type"),
            "price": p["prices"]["price"], "in_stock": p.get("is_in_stock"),
            "short_description": p.get("short_description"), "description": p.get("description"),
            "categories": [c["slug"] for c in p.get("categories", [])],
            "attributes": [{"name": a["name"], "terms": [t["name"] for t in a.get("terms", [])]} for a in p.get("attributes", [])],
            "images": len(p.get("images", []))})
    print("page", page, len(data)); page += 1
OUT.write_text(json.dumps(rows, ensure_ascii=False, indent=1), encoding="utf-8")
print("ok", len(rows), "produits ->", OUT)
