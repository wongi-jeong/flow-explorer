// 쇼핑몰 웹 서비스: 구성도 4개(웹 요청 · 비동기 처리 · 배포 · 관측)
// 사용자와 결제 웹훅은 CDN을 거쳐서만 들어온다. API 서버는 Kubernetes 클러스터의 파드, 작업·DB·관측은 VPC 안의 VM이다.
// 결제 · 메일 · GitHub · Slack은 외부 서비스다.

// 1. 웹 요청: CDN → 로드밸런서 → API 파드(같은 JVM의 결제 모듈) → 캐시 · DB 주 서버 · 복제본, 외부 결제 서비스
TOPO.svc = { vb:{ x:40, y:25, w:1060, h:985 }, col:130 };   // 시퀀스 너비 = 60 + 열 수 × col (넘치면 가로 스크롤)
TOPO.svc.N = {
  user:   { x:170, y:100, nm:"사용자 브라우저", rl:"PC · 모바일", sn:"브라우저", al:"브라우저", iso:["laptop", "person"] },
  cdn:    { x:420, y:100, nm:"CDN", rl:"캐시 · WAF", full:"CDN (엣지 캐시 · WAF)", iso:["shield", "arrows"], brand:"cloudflare" },
  stripe: { x:980, y:100, nm:"결제 서비스", rl:"Stripe API", full:"결제 서비스 (Stripe)", sm:1, iso:["rack", "building"], brand:"stripe" },
  lb:     { x:420, y:350, nm:"로드밸런서", rl:"TLS 종료 · :443", full:"로드밸런서 (클라우드 L7)", al:"LB", iso:["flat", "lock"] },
  redis:  { x:170, y:600, nm:"캐시", rl:"Redis · :6379", full:"캐시 · 세션 저장소 (Redis)", iso:["db", "sparkle"], brand:"redis" },
  api:    { x:420, y:600, nm:"API 서버", rl:"Spring Boot · :8080", full:"API 서버 (Spring Boot)", al:"API", iso:["rack", "code"], brand:"spring" },
  pay:    { x:700, y:600, nm:"결제 모듈", rl:"같은 JVM 안", full:"결제 모듈 (API 서버와 같은 JVM)", iso:["doc"] },
  pgr:    { x:170, y:850, nm:"DB 복제본", rl:"읽기 전용 · :5432", full:"DB 복제본 (PostgreSQL)", al:"복제본", iso:["db", "down"], brand:"postgresql" },
  pg:     { x:420, y:850, nm:"DB 주 서버", rl:"PostgreSQL · :5432", full:"DB 주 서버 (PostgreSQL)", al:"주 DB", iso:["db", "layers"], brand:"postgresql" }
};
TOPO.svc.G = [
  { id:"s_vpc", x:60,  y:230, w:810, h:760, cls:"n", t:"클라우드 VPC", ic:"cloud" },
  { id:"s_k8s", x:300, y:490, w:540, h:250, cls:"b", t:"클러스터", ic:"cluster" },
  { id:"s_pod", x:330, y:520, w:480, h:190, cls:"b", t:"API 파드 (JVM)", ic:"box" },
  { id:"s_db",  x:90,  y:770, w:440, h:190, cls:"b", t:"DB VM", ic:"vm" }
];
// 선은 직교 경로. 아이콘 옆은 가운데에서 36, 위는 36, 아래는 이름 밑(80)에 닿는다(작은 아이콘은 30 · 30 · 74).
// 아이콘 오른쪽 위는 미니 로고 자리라 선을 내지 않는다.
TOPO.svc.L = {
  user_cdn:   { a:"user",   b:"cdn",    p:[[206, 100], [384, 100]] },
  cdn_lb:     { a:"cdn",    b:"lb",     p:[[420, 180], [420, 314]] },
  stripe_cdn: { a:"stripe", b:"cdn",    p:[[950, 100], [456, 100]] },
  lb_api:     { a:"lb",     b:"api",    p:[[420, 430], [420, 564]] },
  api_redis:  { a:"api",    b:"redis",  p:[[384, 600], [206, 600]] },
  api_pay:    { a:"api",    b:"pay",    p:[[456, 600], [664, 600]] },
  pay_stripe: { a:"pay",    b:"stripe", p:[[736, 600], [980, 600], [980, 174]] },
  api_pg:     { a:"api",    b:"pg",     p:[[420, 680], [420, 814]] },
  api_pgr:    { a:"api",    b:"pgr",    p:[[384, 620], [260, 620], [260, 850], [206, 850]] },
  pg_pgr:     { a:"pg",     b:"pgr",    p:[[384, 870], [206, 870]], bg:1 }   // 스트리밍 복제(번호 없는 배경 연결)
};
TOPO.svc.order = ["user", "cdn", "lb", "api", "pay", "stripe", "redis", "pgr", "pg"];
TOPO.svc.sr = { user:"사용자", cdn:"shop.<도메인>", lb:":443", api:":8080", pay:"같은 JVM", stripe:"api.stripe.com",
  redis:":6379", pgr:"읽기", pg:"쓰기" };

// 2. 비동기 처리: 아웃박스 릴레이 → 메시지 큐 → 영수증 워커 → 파일 저장소 · 메일 서비스
TOPO.job = { vb:{ x:40, y:30, w:840, h:790 }, col:130 };
TOPO.job.N = {
  pg:     { x:180, y:160, nm:"DB 주 서버", rl:"PostgreSQL · :5432", full:"DB 주 서버 (PostgreSQL)", al:"주 DB", iso:["db", "layers"], brand:"postgresql" },
  relay:  { x:450, y:160, nm:"아웃박스 릴레이", rl:"1초마다 확인", sn:"릴레이", al:"릴레이", iso:["rack", "list"] },
  mq:     { x:450, y:410, nm:"메시지 큐", rl:"RabbitMQ · :5672", full:"메시지 큐 (RabbitMQ)", al:"큐", iso:["layers"], brand:"rabbitmq" },
  worker: { x:450, y:660, nm:"영수증 워커", rl:"Node.js", al:"워커", iso:["rack", "gear"], brand:"nodejs" },
  s3:     { x:180, y:660, nm:"파일 저장소", rl:"S3 API · :9000", full:"파일 저장소 (S3 호환)", iso:["archive"] },
  mail:   { x:770, y:660, nm:"메일 서비스", rl:"SendGrid API", full:"메일 서비스 (SendGrid)", al:"메일", sm:1, iso:["rack", "building"], brand:"sendgrid" }
};
TOPO.job.G = [
  { id:"j_vpc", x:60,  y:50,  w:580, h:750, cls:"n", t:"클라우드 VPC", ic:"cloud" },
  { id:"j_db",  x:90,  y:80,  w:180, h:190, cls:"b", t:"DB VM", ic:"vm" },
  { id:"j_vm",  x:330, y:80,  w:280, h:690, cls:"b", t:"작업 VM", ic:"vm" },
  { id:"j_ext", x:680, y:560, w:180, h:200, cls:"d", t:"외부 서비스", ic:"globe" }
];
TOPO.job.L = {
  relay_pg:    { a:"relay",  b:"pg",     p:[[414, 160], [216, 160]] },
  relay_mq:    { a:"relay",  b:"mq",     p:[[450, 240], [450, 374]] },
  mq_worker:   { a:"mq",     b:"worker", p:[[450, 490], [450, 624]] },
  worker_pg:   { a:"worker", b:"pg",     p:[[414, 640], [300, 640], [300, 180], [216, 180]] },
  worker_s3:   { a:"worker", b:"s3",     p:[[414, 660], [216, 660]] },
  worker_mail: { a:"worker", b:"mail",   p:[[486, 660], [740, 660]] }
};
TOPO.job.order = ["pg", "relay", "mq", "worker", "s3", "mail"];
TOPO.job.sr = { pg:":5432", relay:"작업 VM", mq:":5672", worker:"작업 VM", s3:":9000", mail:"api.sendgrid.com" };

// 3. 배포: PR 병합 → VPC 안의 CI 러너(자체 호스팅) → 레지스트리 → 클러스터 → 비밀값 저장소 · DB 마이그레이션 → 롤링 업데이트
TOPO.ci = { vb:{ x:40, y:30, w:1070, h:870 }, col:130 };
TOPO.ci.N = {
  dev:     { x:170, y:160, nm:"개발자 PC", rl:"gh · git", al:"개발자", iso:["laptop", "code"] },
  github:  { x:430, y:160, nm:"저장소", rl:"main 브랜치", full:"GitHub 저장소", iso:["doc"], brand:"github" },
  ghcr:    { x:430, y:460, nm:"이미지 레지스트리", rl:"ghcr.io", sn:"레지스트리", full:"컨테이너 이미지 레지스트리 (ghcr.io)", al:"레지스트리", iso:["registry"] },
  actions: { x:720, y:160, nm:"CI 러너", rl:"GitHub Actions", full:"CI 러너 (GitHub Actions, 자체 호스팅)", al:"러너", iso:["toolbox"], brand:"githubactions" },
  kube:    { x:720, y:460, nm:"Kubernetes", rl:"API 서버 · :6443", full:"Kubernetes 클러스터", al:"클러스터", iso:["rack", "gear"], brand:"kubernetes" },
  api:     { x:980, y:460, nm:"API 파드", rl:"새 이미지 · :8080", full:"API 서버 파드", al:"API", iso:["rack", "code"], brand:"spring" },
  pg:      { x:720, y:740, nm:"DB 주 서버", rl:"PostgreSQL · :5432", full:"DB 주 서버 (PostgreSQL)", al:"주 DB", iso:["db", "layers"], brand:"postgresql" },
  vault:   { x:980, y:740, nm:"비밀값 저장소", rl:"Vault · :8200", full:"비밀값 저장소 (Vault)", al:"Vault", iso:["padlock"], brand:"vault" }
};
TOPO.ci.G = [
  { id:"c_gh",  x:330, y:80,  w:200, h:490, cls:"d", t:"GitHub", ic:"globe" },
  { id:"c_vpc", x:600, y:50,  w:490, h:830, cls:"n", t:"클라우드 VPC", ic:"cloud" },
  { id:"c_run", x:630, y:80,  w:180, h:190, cls:"b", t:"러너 VM", ic:"vm" },
  { id:"c_k8s", x:630, y:380, w:430, h:190, cls:"b", t:"클러스터", ic:"cluster" },
  { id:"c_db",  x:630, y:660, w:180, h:190, cls:"b", t:"DB VM", ic:"vm" }
];
TOPO.ci.L = {
  dev_github:     { a:"dev",     b:"github", p:[[206, 160], [394, 160]] },
  actions_github: { a:"actions", b:"github", p:[[684, 160], [466, 160]] },
  actions_ghcr:   { a:"actions", b:"ghcr",   p:[[684, 180], [565, 180], [565, 440], [466, 440]] },
  kube_ghcr:      { a:"kube",    b:"ghcr",   p:[[684, 480], [466, 480]] },
  actions_kube:   { a:"actions", b:"kube",   p:[[720, 240], [720, 424]] },
  kube_api:       { a:"kube",    b:"api",    p:[[756, 460], [944, 460]] },
  kube_pg:        { a:"kube",    b:"pg",     p:[[720, 540], [720, 704]] },
  kube_vault:     { a:"kube",    b:"vault",  p:[[756, 480], [860, 480], [860, 740], [944, 740]] }
};
TOPO.ci.order = ["dev", "github", "actions", "ghcr", "kube", "vault", "pg", "api"];
TOPO.ci.sr = { dev:"로컬", github:"github.com", actions:"러너 VM", ghcr:"ghcr.io", kube:":6443", vault:":8200", pg:":5432", api:":8080" };

// 4. 관측: 로그는 API → 수집기 → 로그 저장소, 지표는 Prometheus가 가져가고 경보는 Alertmanager → Slack
// DB VM은 DB가 아니라 VM 전체의 지표(node_exporter)를 보므로 VM 상자 자체를 참여자로 쓴다(grp). 대시보드는 배경 연결로 데이터를 읽는다.
TOPO.obs = { vb:{ x:40, y:40, w:1060, h:810 }, col:130 };
TOPO.obs.N = {
  api:     { x:190, y:170, nm:"API 서버", rl:"Spring Boot · :8080", full:"API 서버 (Spring Boot)", al:"API", iso:["rack", "code"], brand:"spring" },
  otel:    { x:450, y:170, nm:"수집기", rl:"OTLP · :4317", full:"텔레메트리 수집기 (OpenTelemetry Collector)", iso:["funnel"], brand:"opentelemetry" },
  loki:    { x:710, y:170, nm:"로그 저장소", rl:"Loki · :3100", full:"로그 저장소 (Loki)", al:"Loki", iso:["archive", "list"], brand:"loki" },
  prom:    { x:450, y:430, nm:"Prometheus", rl:"지표 · :9090", full:"지표 저장소 (Prometheus)", iso:["gauge"], brand:"prometheus" },
  grafana: { x:710, y:430, nm:"대시보드", rl:"Grafana · :3000", full:"대시보드 (Grafana)", iso:["flat", "window"], brand:"grafana" },
  am:      { x:450, y:690, nm:"경보 관리자", rl:"Alertmanager · :9093", full:"경보 관리자 (Alertmanager)", al:"Alertmanager", iso:["rack", "bang"] },
  slack:   { x:1000, y:690, nm:"Slack", rl:"#shop-alerts", full:"Slack (운영 채널)", sm:1, iso:["rack", "person"], brand:"slack" },
  pg:      { x:190, y:680, nm:"DB 주 서버", rl:"PostgreSQL · :5432", full:"DB 주 서버 (PostgreSQL)", al:"주 DB", iso:["db", "layers"], brand:"postgresql" },
  dbvm:    { grp:"o_db", nm:"DB VM" }
};
TOPO.obs.G = [
  { id:"o_vpc", x:60,  y:60,  w:770, h:770, cls:"n", t:"클라우드 VPC", ic:"cloud" },
  { id:"o_k8s", x:90,  y:90,  w:200, h:190, cls:"b", t:"클러스터", ic:"cluster" },
  { id:"o_db",  x:90,  y:600, w:200, h:190, cls:"b", t:"DB VM", ic:"vm" },
  { id:"o_vm",  x:350, y:90,  w:450, h:710, cls:"b", t:"관측 VM", ic:"vm" },
  { id:"o_ext", x:920, y:590, w:160, h:200, cls:"d", t:"외부 서비스", ic:"globe" }
];
TOPO.obs.L = {
  api_otel:  { a:"api",     b:"otel",  p:[[226, 170], [414, 170]] },
  otel_loki: { a:"otel",    b:"loki",  p:[[486, 170], [674, 170]] },
  prom_api:  { a:"prom",    b:"api",   p:[[414, 430], [190, 430], [190, 250]] },
  prom_db:   { a:"prom",    b:"dbvm",  p:[[414, 450], [260, 450], [260, 600]] },
  prom_am:   { a:"prom",    b:"am",    p:[[450, 510], [450, 654]] },
  am_slack:  { a:"am",      b:"slack", p:[[486, 690], [970, 690]] },
  graf_prom: { a:"grafana", b:"prom",  p:[[674, 430], [486, 430]], bg:1 },   // 대시보드가 읽는 데이터(배경 연결)
  graf_loki: { a:"grafana", b:"loki",  p:[[710, 394], [710, 250]], bg:1 }
};
TOPO.obs.order = ["api", "otel", "loki", "dbvm", "prom", "am", "slack", "grafana", "pg"];
TOPO.obs.sr = { api:":8080", otel:":4317", loki:":3100", prom:":9090", dbvm:":9100", am:":9093", slack:"hooks.slack.com", grafana:":3000" };

LOGO = { cloudflare:"%%ICON_cloudflare%%", stripe:"%%ICON_stripe%%", redis:"%%ICON_redis%%", spring:"%%ICON_spring%%",
  postgresql:"%%ICON_postgresql%%", rabbitmq:"%%ICON_rabbitmq%%", nodejs:"%%ICON_nodejs%%",
  sendgrid:"%%ICON_sendgrid%%", github:"%%ICON_github%%", githubactions:"%%ICON_githubactions%%", kubernetes:"%%ICON_kubernetes%%",
  vault:"%%ICON_vault%%", opentelemetry:"%%ICON_opentelemetry%%", loki:"%%ICON_loki%%", prometheus:"%%ICON_prometheus%%",
  grafana:"%%ICON_grafana%%", slack:"%%ICON_slack%%" };

// 방화벽 규칙. r: 여는 통신, sh: 한 줄 요약, d: 왜 여는지. 구성도가 달라도 같은 규칙이면 같은 번호를 쓴다.
FWR = {
  F1:  { r:"CDN IP 대역 → 로드밸런서 공인 IP · TCP 443", sh:"CDN → LB 443",
         d:"로드밸런서는 CDN에서 온 요청만 받습니다. 사용자 요청과 결제 웹훅 모두 CDN을 거쳐 들어오므로, 원본 주소를 알아도 직접 들어올 수 없습니다." },
  F2:  { r:"로드밸런서 → 클러스터 · TCP 8080", sh:"LB → 클러스터 8080", d:"로드밸런서가 TLS를 푼 요청을 API 파드로 넘기는 길입니다." },
  F3:  { r:"클러스터 → 캐시 · TCP 6379", sh:"클러스터 → 캐시 6379", d:"API 서버가 캐시와 세션을 읽고 쓰는 길입니다. 캐시는 클러스터에서 온 연결만 받습니다." },
  F4:  { r:"클러스터 → DB VM · TCP 5432", sh:"클러스터 → DB VM 5432",
         d:"API 서버가 주 서버에 쓰고 복제본에서 읽는 길입니다. 배포할 때 마이그레이션 작업도 이 길로 스키마를 바꿉니다." },
  F5:  { r:"클러스터 → 결제 서비스 · TCP 443 (나가는 통신)", sh:"클러스터 → 결제 443",
         d:"결제 모듈이 결제 서비스 API를 부르는 길입니다. 나가는 통신도 정해 둔 주소로만 엽니다." },
  F6:  { r:"작업 VM → DB VM · TCP 5432", sh:"작업 VM → DB VM 5432", d:"릴레이가 아웃박스를 읽고 표시하는 길, 워커가 주문을 읽는 길입니다." },
  F7:  { r:"작업 VM → 파일 저장소 · TCP 9000", sh:"작업 VM → 저장소 9000", d:"워커가 영수증 PDF를 올리는 길입니다." },
  F8:  { r:"작업 VM → 메일 서비스 · TCP 443 (나가는 통신)", sh:"작업 VM → 메일 443", d:"워커가 메일 서비스 API로 영수증 메일을 요청하는 길입니다." },
  F9:  { r:"러너 VM → github.com · ghcr.io · TCP 443 (나가는 통신)", sh:"러너 → GitHub 443",
         d:"러너가 작업을 기다리고, 소스를 받고, 이미지를 올리는 길입니다. 연결은 모두 러너가 먼저 열기 때문에 VPC로 들어오는 규칙은 없습니다." },
  F10: { r:"러너 VM → 클러스터 API 서버 · TCP 6443", sh:"러너 → 클러스터 6443",
         d:"러너가 배포 명령을 보내는 길입니다. 클러스터 API 서버는 인터넷에 열지 않고 VPC 안에서만 받습니다." },
  F11: { r:"클러스터 → ghcr.io · TCP 443 (나가는 통신)", sh:"클러스터 → 레지스트리 443", d:"노드가 새 이미지를 받는 길입니다." },
  F12: { r:"클러스터 → 비밀값 저장소 · TCP 8200", sh:"클러스터 → Vault 8200", d:"파드가 DB 계정 같은 비밀값을 받는 길입니다." },
  F13: { r:"클러스터 → 관측 VM · TCP 4317", sh:"클러스터 → 수집기 4317", d:"API 서버가 로그를 수집기로 보내는 길입니다." },
  F14: { r:"관측 VM → 클러스터 · TCP 8080", sh:"관측 VM → 클러스터 8080", d:"Prometheus가 API 서버의 지표 주소를 읽어 가는 길입니다." },
  F15: { r:"관측 VM → DB VM · TCP 9100", sh:"관측 VM → DB VM 9100", d:"Prometheus가 DB VM의 node_exporter에서 VM 지표를 읽어 가는 길입니다." },
  F16: { r:"관측 VM → Slack · TCP 443 (나가는 통신)", sh:"관측 VM → Slack 443", d:"경보 관리자가 Slack 웹훅으로 알림을 보내는 길입니다." }
};

META = { key:"example-web-shop", start:0,
  filters:[["all", "전체"], ["svc", "웹"], ["job", "비동기"], ["ci", "배포"], ["obs", "관측"]],
  inproc:["JVM"],
  fwNet:"우리 망 밖의 통신이라 우리 방화벽 규칙이 필요 없습니다.",
  fwIn:"같은 VM이나 같은 클러스터 안의 통신이라 방화벽을 지나지 않습니다." };
