# 예제

회사·고객과 무관한 공개용 예제입니다. 예제마다 폴더 하나에 `data.json`, `topology.js`, 흐름·구간·패킷 JS를 둡니다. 로고(`icons/`)는 상표라 저장소에 넣지 않으므로, 빌드하기 전에 받습니다.

| 폴더 | 내용 |
|---|---|
| [web-shop](web-shop) | 데이터 형식을 모두 쓴 예제. 쇼핑몰 웹 서비스를 구성도 4개로 나눔: 웹 요청(CDN · 로드밸런서 · Kubernetes의 API 서버와 같은 JVM의 결제 모듈 · Redis · PostgreSQL 주 서버와 복제본 · Stripe 웹훅), 비동기 처리(아웃박스 → RabbitMQ → 영수증 워커 → S3 호환 저장소 · SendGrid), 배포(GitHub Actions 자체 호스팅 러너 · ghcr.io · Vault 임시 DB 계정 · 롤링 업데이트), 관측(OpenTelemetry · Loki · Prometheus · Alertmanager → Slack). 필터 탭, 그룹 상자 3종과 그룹 상자 참여자, 배경 연결, 같은 프로세스 호출, 작은 아이콘, 방화벽 규칙 16개. 흐름 8개, 86단계. 한국어·일본어(`ja.js`) |
| [web-oauth](web-oauth) | 리버스 프록시(nginx) 뒤의 앱 서버(Node.js)와 PostgreSQL, Keycloak OpenID Connect 로그인(인가 코드 + PKCE). VM 3대, 흐름 3개와 전체 흐름, 36단계. 한국어·일본어(`ja.js`) |

```bash
python skills/flow-explorer/fetch_icons.py examples/web-shop "loki=https://raw.githubusercontent.com/grafana/loki/main/docs/sources/logo.png"
python skills/flow-explorer/build.py examples/web-shop out/web-shop.html
python skills/flow-explorer/tests/smoke.py out/web-shop.html out/shots
```

web-shop의 Loki 로고는 svgl·devicon·gilbarbara에 없어 Loki 저장소의 공식 파일로 받습니다. web-oauth는 폴더 이름만 바꿔 같은 순서로 빌드합니다(로고 받기에 추가 인수 없음).
