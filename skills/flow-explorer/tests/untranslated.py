"""빌드한 탐색기에서 번역이 빠진 데이터 글(원문)을 뽑는다. 번역 파일을 처음 만들거나 원문을 고친 뒤에 쓴다.

    python untranslated.py <빌드한 HTML> <언어> [<출력 JSON>]

원문에 한글이 있고 TR[언어]에 없는 글을 원문 그대로(키로 쓸 수 있게) 내보낸다. 출력 JSON을 주지 않으면 화면에 보여 준다.
필요한 패키지: playwright
"""
import asyncio
import json
import pathlib
import sys

from playwright.async_api import async_playwright


async def main(src: str, lang: str, out: pathlib.Path | None) -> int:
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page(locale="en-US")
        errors = []
        page.on("pageerror", lambda e: errors.append(str(e)))
        await page.goto(src)
        await page.wait_for_timeout(600)
        if lang not in await page.evaluate("__flow.langs"):
            print(f"data.json의 langs에 {lang}이 없습니다")
            return 1
        miss = await page.evaluate(f"__flow.untranslated({json.dumps(lang)})")
        await browser.close()
    for e in errors:
        print("JS 오류:", e)
    if out:
        out.write_text(json.dumps(miss, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
        print(f"번역이 빠진 글 {len(miss)}개 → {out}")
    else:
        for s in miss:
            print(s)
        print(f"번역이 빠진 글 {len(miss)}개")
    return 1 if errors else 0


if __name__ == "__main__":
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    if len(sys.argv) < 3:
        sys.exit(__doc__)
    sys.exit(asyncio.run(main(pathlib.Path(sys.argv[1]).resolve().as_uri(), sys.argv[2],
                              pathlib.Path(sys.argv[3]) if len(sys.argv) > 3 else None)))
