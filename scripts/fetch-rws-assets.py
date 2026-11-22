"""Rebuild the local historical deck from the pinned Commons asset manifest.

Optional maintenance command: Python 3 + Pillow. The website itself is buildless.
It only resizes/re-encodes scans; it does not redraw, crop or recolour the cards.
"""
from concurrent.futures import ThreadPoolExecutor, as_completed
from hashlib import sha256
from io import BytesIO
import json
from pathlib import Path
from urllib.request import Request, urlopen

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
MANIFEST = ROOT / 'docs/data/rws-images.json'
AGENT = 'ArcanaPrototype/0.2 (+https://github.com/semiztulki/tarot-prototype)'


def fetch(item):
    card_id, entry = item
    target = ROOT / 'docs' / entry['path'].removeprefix('./')
    if target.is_file() and entry.get('sha256') == sha256(target.read_bytes()).hexdigest():
        return card_id, entry
    with urlopen(Request(entry['download_url'], headers={'User-Agent': AGENT}), timeout=45) as response:
        raw = response.read()
    if entry.get('download_sha256') and sha256(raw).hexdigest() != entry['download_sha256']:
        raise ValueError(f'{card_id}: source image changed; review the source before updating')
    image = Image.open(BytesIO(raw)).convert('RGB')
    image.thumbnail((360, 640), Image.Resampling.LANCZOS)
    target.parent.mkdir(parents=True, exist_ok=True)
    image.save(target, format='WEBP', quality=85, method=6)
    return card_id, {**entry, 'download_sha256': sha256(raw).hexdigest(),
                     'sha256': sha256(target.read_bytes()).hexdigest(),
                     'width': image.width, 'height': image.height,
                     'transformation': 'Resized within 360×640; WebP quality 85. No cropping or recolouring.'}


def main():
    manifest = json.loads(MANIFEST.read_text())
    complete, failures = {}, []
    with ThreadPoolExecutor(max_workers=3) as executor:
        jobs = {executor.submit(fetch, item): item[0] for item in manifest['cards'].items()}
        for job in as_completed(jobs):
            try:
                card_id, entry = job.result()
                complete[card_id] = entry
                if len(complete) % 13 == 0:
                    print(f'Prepared {len(complete)}/78 images', flush=True)
            except Exception as error:
                failures.append(f'{jobs[job]}: {error}')
    if failures:
        raise RuntimeError('\n'.join(failures))
    manifest['cards'] = {key: complete[key] for key in manifest['cards']}
    MANIFEST.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + '\n')
    print(f'All {len(complete)} images prepared', flush=True)


if __name__ == '__main__':
    main()
