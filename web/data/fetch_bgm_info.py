# fetch_bgm_info.py

from playwright.sync_api import sync_playwright
import json
import pathlib
import sys
import time

# Basis-Verzeichnis dieses Skripts
BASE_DIR = pathlib.Path(__file__).parent

# Pfade zu den Quell-Dateien
STATS_PATH = BASE_DIR / "municipalityStats.json"
BGM_PATH   = BASE_DIR / "BGM Übersicht.json"

# Ausgabe-Datei
OUT_PATH   = BASE_DIR / "bgm_info_all.json"

# Prüfen, ob die JSONs da sind
if not STATS_PATH.exists():
    print(f"Error: '{STATS_PATH}' nicht gefunden.", file=sys.stderr)
    sys.exit(1)
if not BGM_PATH.exists():
    print(f"Error: '{BGM_PATH}' nicht gefunden.", file=sys.stderr)
    sys.exit(1)

def fetch_municipality_office(gkz: str) -> dict:
    """
    Lädt https://www.oesterreich.gv.at/orgsearch/orgtyp/10?gkz=<gkz>
    und extrahiert:
      - office_name
      - address
      - telefon
      - fax
      - email
      - homepage
    """
    url = f"https://www.oesterreich.gv.at/orgsearch/orgtyp/10?gkz={gkz}"
    result = {
        "office_name": None,
        "address":     None,
        "telefon":     None,
        "fax":         None,
        "email":       None,
        "homepage":    None,
    }

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        page.goto(url, wait_until="networkidle")

        # 1) Office-Name (<h1>)
        try:
            result["office_name"] = page.locator("h1").first.inner_text().strip()
        except:
            pass

        # 2) dt/dd-Paare im <dl>
        try:
            dts = page.locator("dl dt")
            dds = page.locator("dl dd")
            count = min(dts.count(), dds.count())
            for i in range(count):
                label = dts.nth(i).inner_text().strip().rstrip(":")
                value = dds.nth(i).inner_text().strip().replace("\n", ", ")
                if label == "Adresse":
                    result["address"] = value
                elif label == "Telefon":
                    result["telefon"] = value
                elif label == "Fax":
                    result["fax"] = value
                elif label in ("E-Mail", "E-Mail"):
                    result["email"] = value
                elif label == "Homepage":
                    result["homepage"] = value
        except:
            pass

        browser.close()

    return result

def main():
    # 1) alle GKZ aus municipalityStats.json laden
    stats = json.loads(STATS_PATH.read_text(encoding="utf-8"))
    gkz_list = list(stats.keys())

    out = {}
    total = len(gkz_list)
    print(f"Starte Abfrage für {total} Gemeinden…")

    for idx, gkz in enumerate(gkz_list, start=1):
        # nur numerische GKZ, überspringe „null“-Einträge
        if not gkz.isdigit():
            continue

        print(f"[{idx}/{total}] Fetching GKZ {gkz} …")
        info = fetch_municipality_office(gkz)
        out[gkz] = info

        # kurzer Sleep, damit der Server nicht blockt
        time.sleep(0.5)

    # 2) in Datei schreiben
    OUT_PATH.write_text(json.dumps(out, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"Fertig! Ergebnisse in '{OUT_PATH.name}' gespeichert.")

if __name__ == "__main__":
    main()
