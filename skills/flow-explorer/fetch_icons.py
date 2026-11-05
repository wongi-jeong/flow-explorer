"""데이터 폴더가 쓰는 브랜드 로고를 받아 <데이터 폴더>/icons/에 둔다.

    python fetch_icons.py <데이터 폴더> [이름:슬러그 | 이름=URL ...] [--force]

받을 로고는 topology.js의 LOGO에 적힌 %%ICON_<이름>%%이다. 차례로 찾는다:
  1. svgl              제목이 이름(또는 슬러그)과 정확히 같은 것만 쓴다(검색이 느슨해 다른 상표가 걸릴 수 있다)
  2. devicon           icons/<슬러그>/<슬러그>-original.svg
  3. gilbarbara/logos  logos/<슬러그>-icon.svg, logos/<슬러그>.svg
어디에도 없으면 `이름:다른슬러그`나 `이름=공식 파일 URL`로 다시 받는다. 이미 받은 로고는 --force가 없으면 건너뛴다.
받은 파일은 색까지 그대로 두고, 출처는 icons/manifest.json에 남긴다. 로고는 각 회사의 상표다.
"""
import json
import pathlib
import re
import sys
import urllib.parse
import urllib.request

UA = {"User-Agent": "flow-explorer-fetch-icons"}
NAME = re.compile(r"[A-Za-z0-9_-]+")
EXTS = (".svg", ".png", ".webp")


def get(url: str) -> bytes:
    with urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=15) as r:
        return r.read()


def norm(s: str) -> str:
    return re.sub(r"[^a-z0-9]", "", s.lower())


def svgl(slug: str):
    try:
        items = json.loads(get("https://api.svgl.app?search=" + urllib.parse.quote(slug)))
    except (OSError, ValueError):
        return None
    for it in items if isinstance(items, list) else []:
        if norm(it.get("title", "")) == norm(slug):
            route = it.get("route")
            if isinstance(route, dict):   # 밝은·어두운 판이 따로 있으면 밝은 판(로고 바탕이 밝다)
                route = route.get("light") or route.get("dark")
            return route
    return None


def candidates(slug: str):
    found = svgl(slug)
    return ([("svgl", found)] if found else []) + [
        ("devicon", f"https://raw.githubusercontent.com/devicons/devicon/master/icons/{slug}/{slug}-original.svg"),
        ("gilbarbara", f"https://cdn.jsdelivr.net/gh/gilbarbara/logos/logos/{slug}-icon.svg"),
        ("gilbarbara", f"https://cdn.jsdelivr.net/gh/gilbarbara/logos/logos/{slug}.svg"),
    ]


def kind(b: bytes):
    head = b.lstrip()[:300].lower()
    if head.startswith(b"<svg") or (head.startswith((b"<?xml", b"<!doctype svg")) and b"<svg" in b[:4000].lower()):
        return "svg"
    if b[:8] == b"\x89PNG\r\n\x1a\n":
        return "png"
    if b[:4] == b"RIFF" and b[8:12] == b"WEBP":
        return "webp"
    return None   # 404 화면(HTML) 등


def main() -> None:
    args = [a for a in sys.argv[1:] if a != "--force"]
    force = "--force" in sys.argv[1:]
    if not args:
        sys.exit(__doc__)
    data = pathlib.Path(args[0])
    topology = json.loads((data / "data.json").read_text(encoding="utf-8"))["topology"]
    names = sorted(set(re.findall(r"%%ICON_([A-Za-z0-9_-]+)%%", (data / topology).read_text(encoding="utf-8"))))
    spec = {}
    for a in args[1:]:
        if "=" in a:
            n, v = a.split("=", 1); spec[n] = ("url", v)
        else:
            n, _, v = a.partition(":"); spec[n] = ("slug", v or n)
    names += [n for n in spec if n not in names]

    icons = data / "icons"
    icons.mkdir(exist_ok=True)
    mpath = icons / "manifest.json"
    manifest = json.loads(mpath.read_text(encoding="utf-8")) if mpath.exists() else {}
    failed = []
    for n in names:
        if not NAME.fullmatch(n):
            print(f"건너뜀 {n!r}: 이름은 영문·숫자·_·-만 (파일 이름이 됨)"); failed.append(n); continue
        have = [p for p in icons.glob(n + ".*") if p.suffix in EXTS]
        if have and not force and n not in spec:
            print(f"있음   {n:<14} {have[0].name}"); continue
        how, v = spec.get(n, ("slug", n))
        got = None
        for src, url in ([("url", v)] if how == "url" else candidates(v)):
            try:
                b = get(url)
            except OSError:
                continue
            k = kind(b)
            if k and len(b) >= 50:
                got = (src, url, b, k); break
        if not got:
            failed.append(n); continue
        src, url, b, k = got
        for p in have:   # build.py는 이름이 같은 파일을 하나만 쓰므로 예전 파일을 지운다
            p.unlink()
        (icons / f"{n}.{k}").write_bytes(b)
        manifest[n] = {"source": src, "url": url, "file": f"{n}.{k}", "bytes": len(b)}
        print(f"받음   {n:<14} {src:<10} {len(b):>6}B")
    mpath.write_text(json.dumps(manifest, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    for n in failed:
        print(f"못 받음 {n}: `{n}:다른슬러그`나 `{n}=공식 파일 URL`로 다시 받으세요")
    sys.exit(1 if failed else 0)


if __name__ == "__main__":
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    main()
