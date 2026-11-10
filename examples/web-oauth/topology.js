// 샘플 웹 서비스: 리버스 프록시(nginx) 뒤의 앱 서버와 OpenID Connect 로그인(Keycloak)
// VM 3대(웹·인증·DB)가 한 VPC 안에 있고, 인터넷에는 웹 VM의 443만 열려 있다.
TOPO.web = { vb:{ x:40, y:0, w:680, h:630 }, col:120 };   // 시퀀스 너비 = 60 + 열 수 × col (넘치면 가로 스크롤)
TOPO.web.N = {
  browser:  { x:200, y:60,  nm:"사용자 브라우저", rl:"Chrome · Safari", al:"브라우저", iso:["laptop", "window"] },
  nginx:    { x:200, y:270, nm:"nginx", rl:":443 · TLS 종료", full:"nginx (리버스 프록시)", iso:["flat", "lock"], brand:"nginx" },
  app:      { x:200, y:480, nm:"앱 서버", rl:"Node.js · :3000", full:"앱 서버 (Node.js)", al:"앱", iso:["rack", "code"], brand:"nodejs" },
  keycloak: { x:560, y:270, nm:"Keycloak", rl:"OIDC · :8080", full:"Keycloak (ID 공급자)", iso:["rack", "key"], brand:"keycloak" },
  postgres: { x:560, y:480, nm:"PostgreSQL", rl:"app · keycloak DB", full:"PostgreSQL (DB 서버)", al:"DB", iso:["db", "layers"], brand:"postgresql" }
};
TOPO.web.G = [
  { id:"g_vpc",  x:60,  y:170, w:640, h:440, cls:"n", t:"클라우드 VPC", ic:"cloud" },
  { id:"g_web",  x:90,  y:200, w:220, h:380, cls:"b", t:"웹 VM", ic:"vm" },
  { id:"g_auth", x:450, y:200, w:220, h:170, cls:"b", t:"인증 VM", ic:"vm" },
  { id:"g_db",   x:450, y:410, w:220, h:170, cls:"b", t:"DB VM", ic:"vm" }
];
// 선은 직교 경로. 아이콘 옆은 가운데에서 36, 위는 36, 아래는 이름 밑(80)에 닿는다.
// 아이콘 오른쪽 위는 미니 로고 자리라 선을 내지 않는다(앱 서버의 두 선은 가운데와 그 아래에서 나간다).
TOPO.web.L = {
  br_px:  { a:"browser",  b:"nginx",    p:[[200, 140], [200, 234]] },
  px_app: { a:"nginx",    b:"app",      p:[[200, 350], [200, 444]] },
  px_kc:  { a:"nginx",    b:"keycloak", p:[[236, 270], [524, 270]] },
  app_kc: { a:"app",      b:"keycloak", p:[[236, 480], [400, 480], [400, 290], [524, 290]] },
  app_db: { a:"app",      b:"postgres", p:[[236, 500], [524, 500]] },
  kc_db:  { a:"keycloak", b:"postgres", p:[[560, 350], [560, 444]] }
};
TOPO.web.order = ["browser", "nginx", "app", "keycloak", "postgres"];
TOPO.web.sr = { browser:"사용자", nginx:":443", app:":3000", keycloak:":8080", postgres:":5432" };

LOGO = { nginx:"%%ICON_nginx%%", nodejs:"%%ICON_nodejs%%", keycloak:"%%ICON_keycloak%%", postgresql:"%%ICON_postgresql%%" };

// 방화벽 규칙. r: 여는 통신, sh: 한 줄 요약, d: 왜 여는지
FWR = {
  F1: { r:"인터넷 → 웹 VM 공인 IP · TCP 443", sh:"인터넷 → 웹 VM 443",
        d:"브라우저가 앱(app.<도메인>)과 로그인 화면(auth.<도메인>)을 HTTPS로 여는 길입니다. 두 도메인 모두 웹 VM의 nginx가 받습니다." },
  F2: { r:"웹 VM → 인증 VM 사설 IP · TCP 8080", sh:"웹 VM → 인증 VM 8080",
        d:"nginx가 로그인 화면 요청을 Keycloak으로 넘기고, 앱 서버가 토큰과 서명 키를 받는 길입니다. Keycloak은 인터넷에 직접 열지 않습니다." },
  F3: { r:"웹 VM → DB VM 사설 IP · TCP 5432", sh:"웹 VM → DB VM 5432",
        d:"앱 서버가 app DB의 세션과 주문을 읽고 쓰는 길입니다." },
  F4: { r:"인증 VM → DB VM 사설 IP · TCP 5432", sh:"인증 VM → DB VM 5432",
        d:"Keycloak이 keycloak DB에서 사용자와 비밀번호 해시를 읽는 길입니다. DB VM은 웹 VM과 인증 VM의 사설 IP만 받습니다." }
};

META = { key:"example-web-oauth", start:0 };
