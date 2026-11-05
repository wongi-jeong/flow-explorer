"""흐름 탐색기 빌드: 엔진(engine/explorer.html) + 데이터 폴더 → 파일 하나로 된 HTML.

    python build.py <데이터 폴더> [<출력 파일>]

데이터 폴더에는 data.json(제목, langs, topology, scripts, 선택으로 css)과 그 파일들, icons/(브랜드 로고)가 있다.
langs는 화면 언어 목록이고 첫째가 데이터의 원문 언어다(없으면 ["ko"]). 둘 이상이면 언어 메뉴가 나온다.
css는 엔진 CSS 뒤에 넣을 CSS 파일 목록이다. 엔진의 색 변수(--ink, --btn, --req 등)를 덮어써 색을 바꾼다.
글꼴: Iosevka(engine/fonts/iosevka-*.woff2, 라틴 부분 글꼴)는 글자를 그대로 두고, 한글 글꼴(Nanum Gothic Coding)과
일본어 글꼴(M PLUS 1 Code, langs에 ja가 있을 때만)은 페이지에 쓰인 글자만 골라 넣는다.
OFL의 예약 글꼴 이름 조항에 맞춰 줄인 한글 글꼴의 이름은 "Flow Hangul Coding"으로 바꾼다(M PLUS 1 Code는 예약 이름이 없다).
넣는 글꼴마다 라이선스 정보(name 테이블 13·14번)를 OFL로 채우고, 생성 시각을 바꾸지 않아 같은 데이터면 결과가 같다.
필요한 패키지: fonttools, brotli (pip install fonttools brotli)
"""
import base64
import io
import json
import pathlib
import re
import sys

from fontTools import subset
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer

ENGINE = pathlib.Path(__file__).resolve().parent / "engine"
FONTS = ENGINE / "fonts"
OFL_URL = "https://openfontlicense.org"
OFL_DESC = "This Font Software is licensed under the SIL Open Font License, Version 1.1. This license is available with a FAQ at: " + OFL_URL


def woff2_b64(font: TTFont) -> str:
    """라이선스 정보(OFL FAQ 2.4)를 넣은 woff2를 base64로 돌려준다."""
    names = font["name"]
    for name_id, text in ((13, OFL_DESC), (14, OFL_URL)):
        names.removeNames(nameID=name_id)
        names.setName(text, name_id, 3, 1, 0x409)
    buf = io.BytesIO()
    font.flavor = "woff2"
    font.save(buf)
    return base64.b64encode(buf.getvalue()).decode()


def subset_font(font: TTFont, chars) -> TTFont:
    opts = subset.Options()
    opts.layout_features = []; opts.name_IDs = ["*"]; opts.notdef_outline = True
    sub = subset.Subsetter(opts)
    sub.populate(unicodes=[ord(c) for c in chars])
    sub.subset(font)
    return font


def build(data_dir: pathlib.Path, out: pathlib.Path) -> None:
    cfg = json.loads((data_dir / "data.json").read_text(encoding="utf-8"))
    langs = cfg.get("langs") or ["ko"]
    ja = "ja" in langs
    html = (ENGINE / "explorer.html").read_text(encoding="utf-8")
    for token in ("/*@@TOPOLOGY@@*/", "/*@@FLOWS@@*/", "/*@@THEME@@*/", "%%TITLE%%", "%%SUBTITLE%%", "%%LANGS%%"):
        if token not in html:
            sys.exit(f"엔진에 자리 표시가 없음: {token}")
    # 글꼴에 넣을 글자는 화면에 나올 수 있는 글자만 모은다: 주석을 뺀 엔진 + 데이터 전부
    plain = re.sub(r"/\*[\s\S]*?\*/|<!--[\s\S]*?-->", "", html)
    plain = re.sub(r"(?m)^\s*//.*$|(?<=[;{}),\]])\s+//\s.*$", "", plain)
    visible = plain + cfg["title"] + cfg.get("subtitle", "") + "".join(
        (data_dir / n).read_text(encoding="utf-8") for n in [cfg["topology"], *cfg["scripts"]])
    esc = lambda t: t.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")
    html = html.replace("%%TITLE%%", esc(cfg["title"])).replace("%%SUBTITLE%%", esc(cfg.get("subtitle", "")))
    html = html.replace("%%LANGS%%", json.dumps(langs))
    html = html.replace("/*@@TOPOLOGY@@*/", (data_dir / cfg["topology"]).read_text(encoding="utf-8"))
    html = html.replace("/*@@FLOWS@@*/", "\n".join((data_dir / n).read_text(encoding="utf-8") for n in cfg["scripts"]))
    # 데이터의 CSS(선택): 엔진 CSS 뒤에 넣어 색 변수를 덮어쓴다
    css = [(data_dir / n).read_text(encoding="utf-8") for n in cfg.get("css", [])]
    if any(re.search(r"</style", t, re.I) for t in css):
        sys.exit("css 파일에 </style 이 있으면 HTML이 깨짐")
    html = html.replace("/*@@THEME@@*/", "\n".join(css))
    # 일본어를 쓰지 않으면 일본어 글꼴 선언을 통째로 뺀다
    if ja:
        html = html.replace("/*@@JA_FONTS*/\n", "").replace("/*JA_FONTS@@*/\n", "")
    else:
        html = re.sub(r"/\*@@JA_FONTS\*/\n.*?/\*JA_FONTS@@\*/\n", "", html, flags=re.S)

    for w in (400, 600, 800):
        html = html.replace(f"%%FONT_IO{w}%%", woff2_b64(TTFont(FONTS / f"iosevka-{w}.woff2", recalcTimestamp=False)))

    # 일본어 글꼴: 가나·한자·전각 기호만 골라 굵기 400·700으로 넣는다(가변 글꼴을 고정 굵기로 바꾼다)
    jchars = []
    if ja:
        jchars = sorted(set(re.findall(r"[　-〿぀-ヿㇰ-ㇿ一-鿿＀-￯]", visible)))
        for w in (400, 700):
            font = subset_font(TTFont(FONTS / "MPLUS1Code-wght.ttf", recalcTimestamp=False), jchars)
            html = html.replace(f"%%FONT_JA{w}%%", woff2_b64(instancer.instantiateVariableFont(font, {"wght": w})))

    # 한글 글꼴: 한글과 전각 기호(일본어 글꼴이 없으면 한자·가나도)만 골라 줄인다
    ko_re = re.compile(r"[ᄀ-ᇿ　-〿㄰-㆏가-힣＀-￯]" if ja else r"[ᄀ-ᇿ　-〿㄰-㆏぀-ヿ一-鿿가-힣＀-￯]")
    chars = sorted(set(ko_re.findall(visible)))
    for weight, fn in (("400", "NanumGothicCoding-Regular.ttf"), ("700", "NanumGothicCoding-Bold.ttf")):
        font = subset_font(TTFont(FONTS / fn, recalcTimestamp=False), chars)
        style = "Regular" if weight == "400" else "Bold"
        for rec in font["name"].names:
            if rec.nameID in (1, 16):
                rec.string = "Flow Hangul Coding"
            elif rec.nameID == 4:
                rec.string = "Flow Hangul Coding " + style
            elif rec.nameID in (3, 6):
                rec.string = "FlowHangulCoding-" + style
        html = html.replace(f"%%FONT_KO{weight}%%", woff2_b64(font))

    mime = {"svg": "image/svg+xml", "png": "image/png", "webp": "image/webp"}
    icons = data_dir / "icons"
    if icons.is_dir():
        for f in sorted(icons.iterdir()):
            ext = f.suffix.lstrip(".")
            if ext in mime:
                html = html.replace(f"%%ICON_{f.stem}%%", f"data:{mime[ext]};base64," + base64.b64encode(f.read_bytes()).decode())
    # 받지 않은 로고는 빈 값으로 두면 엔진이 미니 로고를 그리지 않는다
    missing = sorted(set(re.findall(r"%%ICON_([A-Za-z0-9_-]+)%%", html)))
    if missing:
        html = re.sub(r"%%ICON_[A-Za-z0-9_-]+%%", "", html)
        print(f"로고 없음(미니 로고 생략): {', '.join(missing)} → python {pathlib.Path(__file__).parent / 'fetch_icons.py'} {data_dir}")
    left = sorted(set(re.findall(r"%%[A-Za-z0-9_]+%%", html)))
    if left:
        sys.exit(f"채우지 못한 자리 표시: {left}")
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(html, encoding="utf-8")
    print(f"built {out} {len(html.encode('utf-8')) // 1024} KB · 언어 {'·'.join(langs)} · 한글 글꼴 {len(chars)}자" +
          (f" · 일본어 글꼴 {len(jchars)}자" if ja else ""))


if __name__ == "__main__":
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    if len(sys.argv) < 2:
        sys.exit(__doc__)
    d = pathlib.Path(sys.argv[1]).resolve()
    build(d, pathlib.Path(sys.argv[2]).resolve() if len(sys.argv) > 2 else d / "build" / "explorer.html")
