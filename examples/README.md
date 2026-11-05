# 예제

회사·고객과 무관한 공개용 예제입니다. 예제마다 폴더 하나에 `data.json`, `topology.js`, 흐름·구간·패킷 JS를 둡니다. 로고(`icons/`)는 상표라 저장소에 넣지 않으므로, 빌드하기 전에 받습니다.

| 폴더 | 내용 |
|---|---|
| [web-oauth](web-oauth) | 리버스 프록시(nginx) 뒤의 앱 서버(Node.js)와 PostgreSQL, Keycloak OpenID Connect 로그인(인가 코드 + PKCE). VM 3대, 흐름 3개와 전체 흐름, 36단계. 한국어·일본어(`ja.js`) |

```bash
python skills/flow-explorer/fetch_icons.py examples/web-oauth
python skills/flow-explorer/build.py examples/web-oauth out/web-oauth.html
python skills/flow-explorer/tests/smoke.py out/web-oauth.html out/shots
```
