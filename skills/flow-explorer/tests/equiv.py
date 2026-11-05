"""두 빌드가 같은 화면을 그리는지 비교한다(엔진을 고친 뒤 회귀 확인용).

    python equiv.py <기준 HTML> <새 HTML>
"""
import asyncio, sys, pathlib
from playwright.async_api import async_playwright
A = pathlib.Path(sys.argv[1]).resolve().as_uri(); B = pathlib.Path(sys.argv[2]).resolve().as_uri()
STEPS = (-1, 0, 5, 12, 21, 999)
GRAB = "() => ['list','det','net','cap','seqHead','seq','ftabs','tsegs','segs'].map(id => { const e = document.getElementById(id); return e ? e.innerHTML : null; }).concat([document.title, document.querySelector('.brand h1').textContent, document.querySelector('.brand .sub').textContent])"
async def snap(pg, url):
    await pg.goto(url); await pg.wait_for_timeout(700)
    # 원문 언어로 비교한다(브라우저 언어를 따라 다른 언어로 열릴 수 있다). 언어 기능이 없는 예전 빌드도 연다.
    await pg.evaluate("localStorage.clear(); __flow.setTheme('light'); if (__flow.setLang) __flow.setLang(__flow.langs[0])")
    out = []
    nsc = await pg.evaluate("__flow.data.SC.length")
    for k, i in [(k, i) for k in range(nsc) for i in STEPS]:
        await pg.evaluate("__flow.pick(%d); __flow.go(%d)" % (k, i)); await pg.wait_for_timeout(40)
        out.append(await pg.evaluate(GRAB))
    await pg.evaluate("__flow.tab('seq')"); await pg.wait_for_timeout(200)
    for k in range(nsc):
        await pg.evaluate("__flow.pick(%d); __flow.go(3)" % k); await pg.wait_for_timeout(40)
        out.append(await pg.evaluate(GRAB))
    return out
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch()
        # 빌드마다 새 컨텍스트로 연다. 제목이 같은 두 빌드는 본 기록(localStorage)을 같이 써서,
        # 한 페이지에서 차례로 열면 뒤 빌드가 앞 빌드의 기록을 읽고 시작한다.
        async def fresh(url):
            ctx = await b.new_context(viewport={"width":1440,"height":900}, reduced_motion="reduce", locale="en-US")
            try:
                return await snap(await ctx.new_page(), url)
            finally:
                await ctx.close()
        a = await fresh(A); bb = await fresh(B)
        diffs = 0
        names = ['list','det','net','cap','seqHead','seq','ftabs','tsegs','segs','title','h1','sub']
        for n, (x, y) in enumerate(zip(a, bb)):
            for j, (u, v) in enumerate(zip(x, y)):
                if u != v:
                    diffs += 1
                    if diffs <= 6:
                        u, v = u or '', v or ''
                        k = next((q for q in range(min(len(u), len(v))) if u[q] != v[q]), min(len(u), len(v)))
                        print("diff state", n, names[j], "|", u[max(0,k-60):k+80], "||", v[max(0,k-60):k+80])
        print("compared", len(a), "states; differing fields:", diffs)
        await b.close()
sys.stdout.reconfigure(encoding="utf-8", errors="replace")
asyncio.run(main())
