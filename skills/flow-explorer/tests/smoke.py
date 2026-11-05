"""빌드한 탐색기 하나를 헤드리스 Chromium으로 열어 기본 검사를 한다.

    python smoke.py <빌드한 HTML> [<스크린샷 폴더>]

검사: 모든 흐름의 모든 단계를 지나며 JS 오류, 단계마다 패킷 데이터(PKT)가 있는지,
미니 로고가 선·선 끝(패킷이 멈추는 점)·패킷 말풍선과 겹치는지, 휴대폰 폭에서 가로 스크롤이 생기는지,
언어가 둘 이상이면 언어마다 번역이 빠진 데이터 글과 화면에 남은 원문(한국어).
필요한 패키지: playwright (pip install playwright && python -m playwright install chromium)
"""
import asyncio
import pathlib
import sys

from playwright.async_api import async_playwright

BADGES = r"""() => {
  const net = document.getElementById('net'), inv = net.getScreenCTM().inverse();
  return Array.from(net.querySelectorAll('rect.bdg')).map(r => {
    const b = r.getBBox(), m = inv.multiply(r.getScreenCTM());
    const xs = [b.x, b.x + b.width].map(x => m.a * x + m.e), ys = [b.y, b.y + b.height].map(y => m.d * y + m.f);
    return { node: r.closest('.node').querySelector('.nm').textContent, r: { x1: Math.min(...xs), y1: Math.min(...ys), x2: Math.max(...xs), y2: Math.max(...ys) } };
  });
}"""
LINES = r"""(badges) => {
  const L = __flow.topoL(), out = [];
  const near = (a, b, r, pad) => { for (let k = 0; k <= 24; k++) { const x = a[0] + (b[0] - a[0]) * k / 24, y = a[1] + (b[1] - a[1]) * k / 24;
    if (x > r.x1 - pad && x < r.x2 + pad && y > r.y1 - pad && y < r.y2 + pad) return true; } return false; };
  badges.forEach(bd => Object.keys(L).forEach(id => { const p = L[id].p;
    for (let k = 1; k < p.length; k++) if (near(p[k - 1], p[k], bd.r, 3)) { out.push(bd.node + ' ↔ 선 ' + id); break; }
    [p[0], p[p.length - 1]].forEach(e => { if (near(e, e, bd.r, 10)) out.push(bd.node + ' ↔ 선 끝 ' + id); });
  }));
  return out;
}"""
TAG = r"""(badges) => {
  const net = document.getElementById('net'), inv = net.getScreenCTM().inverse(), bg = document.querySelector('.ptag rect');
  if (!bg) return [];
  const b = bg.getBBox(), m = inv.multiply(bg.getScreenCTM());
  const r = { x1: m.a * b.x + m.e, y1: m.d * b.y + m.f, x2: m.a * (b.x + b.width) + m.e, y2: m.d * (b.y + b.height) + m.f };
  return badges.filter(bd => !(bd.r.x2 < r.x1 || bd.r.x1 > r.x2 || bd.r.y2 < r.y1 || bd.r.y1 > r.y2)).map(bd => bd.node);
}"""
# 원문이 한국어일 때, 다른 언어 화면에 남은 한국어(보이는 글, 구성도·시퀀스 글, title·aria-label)
LEFT_KO = r"""() => {
  const re = /[가-힣]/, out = new Set();
  const add = t => String(t).split(/\n+/).forEach(l => { l = l.trim(); if (re.test(l)) out.add(l.slice(0, 70)); });
  add(document.querySelector('.app').innerText);
  ['net', 'seq', 'seqHead'].forEach(id => document.querySelectorAll('#' + id + ' text, #' + id + ' title').forEach(e => add(e.textContent)));
  document.querySelectorAll('.app [title], .app [aria-label]').forEach(e => ['title', 'aria-label'].forEach(a => {
    const v = e.getAttribute(a); if (v && re.test(v)) out.add('@' + a + ' ' + v.slice(0, 60)); }));
  if (re.test(document.title)) out.add('@title ' + document.title);
  return [...out];
}"""


async def main(src: str, shots: pathlib.Path | None) -> int:
    problems = []
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        # locale을 고정한다: 탐색기는 브라우저 언어를 따라 열리므로 PC 설정에 따라 결과가 달라지지 않게
        page = await browser.new_page(viewport={"width": 1440, "height": 900}, reduced_motion="reduce", locale="en-US")
        page.on("pageerror", lambda e: problems.append("JS 오류: " + str(e)))
        await page.goto(src)
        await page.wait_for_timeout(700)
        await page.evaluate("localStorage.clear(); __flow.setTheme('light'); __flow.setLang(__flow.langs[0]); __flow.st.follow = false")
        flows = await page.evaluate("__flow.data.SC.map(sc => ({ tp: sc.tp, t: sc.t, n: sc.st.length }))")
        has_pkt = await page.evaluate("!!__flow.data.PKT && Object.keys(__flow.data.PKT).length > 0")
        seen = set()
        for k, f in enumerate(flows):
            await page.evaluate(f"__flow.pick({k})")
            await page.click("#zFit")
            await page.wait_for_timeout(80)
            badges = await page.evaluate(BADGES)
            if f["tp"] not in seen:
                seen.add(f["tp"])
                problems += [f"[{f['tp']}] 로고 겹침: {h}" for h in await page.evaluate(LINES, badges)]
            for i in range(f["n"]):
                await page.evaluate(f"__flow.go({i})")
                hit = await page.evaluate(TAG, badges)
                if hit:
                    problems.append(f"[{f['t']}] 단계 {i + 1} 말풍선이 로고를 덮음: {hit}")
            if has_pkt:
                miss = await page.evaluate(f"__flow.data.SC[{k}].st.filter(s => !(__flow.data.PKT[__flow.data.SC[{k}].tp] || {{}})[s.n]).map(s => s.n)")
                if miss:
                    problems.append(f"[{f['t']}] 패킷 데이터 없는 단계: {miss}")
            if shots:
                await page.screenshot(path=str(shots / f"flow-{k}.png"))
        # 언어: 원문 언어 말고 다른 언어마다 모든 흐름·단계를 지나며 번역이 빠진 곳을 찾는다
        langs = await page.evaluate("__flow.langs")
        for lang in langs[1:]:
            await page.evaluate(f"__flow.setLang('{lang}')")
            miss = await page.evaluate(f"__flow.untranslated('{lang}')")
            if miss:
                problems.append(f"[{lang}] 번역이 없는 데이터 글 {len(miss)}개: " + " | ".join(m[:40] for m in miss[:5]))
            left = set()
            if langs[0] == "ko":
                for k, f in enumerate(flows):
                    await page.evaluate(f"__flow.pick({k})")
                    for i in range(-1, f["n"]):
                        if i >= 0:
                            await page.evaluate(f"__flow.go({i})")
                        left |= set(await page.evaluate(LEFT_KO))
                    await page.evaluate("__flow.tab('seq')")
                    left |= set(await page.evaluate(LEFT_KO))
                    await page.evaluate("__flow.tab('net')")
                if left:
                    problems.append(f"[{lang}] 화면에 남은 한국어 {len(left)}곳: " + " | ".join(sorted(left)[:8]))
            if shots:
                await page.evaluate("__flow.pick(0); __flow.go(2)")
                await page.screenshot(path=str(shots / f"lang-{lang}.png"))
            await page.evaluate(f"__flow.setLang('{langs[0]}')")
        await page.evaluate("__flow.setTheme('dark'); __flow.pick(0); __flow.go(0)")
        if shots:
            await page.screenshot(path=str(shots / "dark.png"))
        phone = await browser.new_page(viewport={"width": 390, "height": 844}, locale="en-US")
        phone.on("pageerror", lambda e: problems.append("JS 오류(휴대폰): " + str(e)))
        await phone.goto(src)
        await phone.wait_for_timeout(600)
        width = await phone.evaluate("document.documentElement.scrollWidth")
        if width > 390:
            problems.append(f"휴대폰 폭에서 가로 스크롤: {width}px")
        if shots:
            await phone.screenshot(path=str(shots / "phone.png"), full_page=True)
        await browser.close()
    print(f"흐름 {len(flows)}개, 단계 {sum(f['n'] for f in flows)}개, 언어 {'·'.join(langs)} 검사")
    for x in problems:
        print(" -", x)
    print("통과" if not problems else f"문제 {len(problems)}건")
    return 1 if problems else 0


if __name__ == "__main__":
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    if len(sys.argv) < 2:
        sys.exit(__doc__)
    out = pathlib.Path(sys.argv[2]) if len(sys.argv) > 2 else None
    if out:
        out.mkdir(parents=True, exist_ok=True)
    sys.exit(asyncio.run(main(pathlib.Path(sys.argv[1]).resolve().as_uri(), out)))
