# flow-explorer

프로젝트의 구성(서버·컨테이너·DB·외부 서비스)과 요청·응답 흐름을 단계별로 재생하는 **데이터 흐름 탐색기**를 만드는 Claude Code 플러그인입니다. 결과는 글꼴·로고·데이터가 모두 들어간 HTML 파일 하나라서 인터넷 없이 열립니다.

- 왼쪽: 흐름 목록과 구간·단계 진행(지나간 단계는 초록 체크), 흐름마다 끝까지 봤는지 보여 주는 전체 진행
- 가운데: 아이소메트릭 구성도(패킷이 노드 사이를 움직이고 카메라가 단계를 따라감)와 시퀀스 화면
- 오른쪽: 단계 설명(경로, 프로토콜, 포트, 방화벽 규칙, 실제 패킷)
- 머리: 지금 보는 흐름과 진행률, 언어 메뉴(한국어·日本語), 라이트·다크 테마. 화면 글자는 엔진이, 데이터 글은 번역 파일(`ja.js`)이 바꿉니다.
- 색: 데이터 폴더의 CSS 파일로 바꿀 수 있습니다(`data.json`의 `css`).

## 설치

```text
/plugin marketplace add wongi-jeong/flow-explorer
/plugin install flow-explorer@flow-explorer
```

설치한 뒤 프로젝트에서 "이 저장소의 데이터 흐름 탐색기 만들어줘"처럼 요청하면 `flow-explorer` 스킬이 저장소를 읽어 데이터 폴더를 만들고 빌드합니다. `/flow-explorer:flow-explorer`로 직접 부를 수도 있습니다.

필요한 것: Python 3.10 이상, `pip install fonttools brotli playwright`, `python -m playwright install chromium`

## 예제 빌드

[examples/web-oauth](examples/web-oauth)는 nginx 뒤의 앱 서버와 PostgreSQL, Keycloak OpenID Connect 로그인(인가 코드 + PKCE)을 담은 예제입니다.

```bash
python skills/flow-explorer/fetch_icons.py examples/web-oauth
python skills/flow-explorer/build.py examples/web-oauth out/web-oauth.html
python skills/flow-explorer/tests/smoke.py out/web-oauth.html out/shots
```

데이터 형식은 [skills/flow-explorer/references/data-format.md](skills/flow-explorer/references/data-format.md)에 있습니다.

## 라이선스

- 코드: [MIT](LICENSE)
- 글꼴: SIL Open Font License 1.1. 원문은 [skills/flow-explorer/engine/fonts/](skills/flow-explorer/engine/fonts/)에 있습니다.
  - [Iosevka](https://github.com/be5invis/Iosevka) 22.1.2: 라틴 글자, 문장 부호, 화살표, 도형 일부만 남긴 부분 글꼴입니다.
  - [Nanum Gothic Coding](https://github.com/naver/nanumfont): 빌드할 때 페이지에 쓰인 글자만 골라 넣습니다. 예약 글꼴 이름(Nanum 등) 조항에 따라 줄인 글꼴의 이름은 "Flow Hangul Coding"입니다.
  - [M PLUS 1 Code](https://github.com/coz-m/MPLUS_FONTS): 데이터에 일본어(`ja`)가 있을 때만 쓰인 글자를 골라 굵기 400·700으로 넣습니다.
  - 빌드한 HTML에도 글꼴마다 저작권과 OFL 정보가 들어갑니다(글꼴 name 테이블과 HTML 안의 주석).
- 로고: 각 회사의 상표입니다. 이 저장소에는 넣지 않고, `fetch_icons.py`가 [svgl](https://svgl.app), [devicon](https://devicon.dev), [gilbarbara/logos](https://github.com/gilbarbara/logos)에서 받습니다.

## 감사

패킷이 오가는 모습을 단계별로 보여 주는 화면은 Dilum Sanjaya의 [Protocol Explorer](https://protocol-explorer-alpha.vercel.app/)에서 아이디어를 얻었습니다. 이 저장소의 코드, 색, 아이콘은 따로 만든 것입니다.

Inspired by [Protocol Explorer](https://protocol-explorer-alpha.vercel.app/) by Dilum Sanjaya. The code, colors and icons in this repository are original work.
