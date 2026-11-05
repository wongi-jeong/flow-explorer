// 단계마다 실제로 오가는 패킷: [프로토콜, 내용]. 내용은 글자 그대로 보이므로 <도메인> 같은 자리표시를 그대로 쓴다.
// 비밀값과 토큰은 넣지 않고 … 로 줄인다.
var AUTH_Q = "response_type=code&client_id=web&redirect_uri=https%3A%2F%2Fapp.<도메인>%2Fcallback&scope=openid%20profile" +
  "&state=<state>&code_challenge=<code_challenge>&code_challenge_method=S256";
var PKT = { web: {
  1:  ["HTTPS", "GET / HTTP/2 · Host: app.<도메인> · Accept: text/html"],
  2:  ["HTTP",  "GET / HTTP/1.1 · Host: app.<도메인> · X-Forwarded-For: <브라우저 IP> · X-Forwarded-Proto: https"],
  3:  ["HTTP",  "HTTP/1.1 200 OK · Content-Type: text/html; charset=utf-8 · Cache-Control: no-store"],
  4:  ["HTTPS", "HTTP/2 200 · content-type: text/html; charset=utf-8"],
  5:  ["HTTPS", "GET /login HTTP/2 · Host: app.<도메인>"],
  6:  ["HTTP",  "GET /login HTTP/1.1 · Host: app.<도메인> · X-Forwarded-Proto: https"],
  7:  ["HTTP",  "HTTP/1.1 302 Found · Location: https://auth.<도메인>/realms/demo/protocol/openid-connect/auth?" + AUTH_Q +
                " · Set-Cookie: login_tx=<서명한 state·code_verifier>; HttpOnly; Secure; SameSite=Lax; Max-Age=600"],
  8:  ["HTTPS", "HTTP/2 302 · location: https://auth.<도메인>/realms/demo/protocol/openid-connect/auth?… · set-cookie: login_tx=…"],
  9:  ["HTTPS", "GET /realms/demo/protocol/openid-connect/auth?" + AUTH_Q + " HTTP/2 · Host: auth.<도메인>"],
  10: ["HTTP",  "GET /realms/demo/protocol/openid-connect/auth?… HTTP/1.1 · Host: auth.<도메인> · X-Forwarded-Proto: https"],
  11: ["HTTP",  "HTTP/1.1 200 OK · Content-Type: text/html;charset=utf-8 · Set-Cookie: AUTH_SESSION_ID=…; KC_RESTART=…"],
  12: ["HTTPS", "HTTP/2 200 · content-type: text/html;charset=utf-8 (로그인 폼)"],
  13: ["HTTPS", "POST /realms/demo/login-actions/authenticate?session_code=…&execution=…&client_id=web&tab_id=… HTTP/2 · " +
                "Content-Type: application/x-www-form-urlencoded · username=<ID>&password=<비밀번호>"],
  14: ["HTTP",  "POST /realms/demo/login-actions/authenticate?… HTTP/1.1 · Host: auth.<도메인> · username=<ID>&password=<비밀번호>"],
  15: ["PGSQL", "Parse·Bind·Execute  SELECT … FROM user_entity WHERE realm_id = $1 AND username = $2 → " +
                "SELECT … FROM credential WHERE user_id = $1 ORDER BY priority"],
  16: ["PGSQL", "RowDescription · DataRow ×1 (user_entity) · DataRow ×1 (credential: 비밀번호 해시) · CommandComplete SELECT 1"],
  17: ["HTTP",  "HTTP/1.1 302 Found · Location: https://app.<도메인>/callback?state=<state>&session_state=…" +
                "&iss=https%3A%2F%2Fauth.<도메인>%2Frealms%2Fdemo&code=<code> · Set-Cookie: KEYCLOAK_IDENTITY=…; KEYCLOAK_SESSION=…"],
  18: ["HTTPS", "HTTP/2 302 · location: https://app.<도메인>/callback?state=<state>&…&code=<code> · set-cookie: KEYCLOAK_IDENTITY=…"],
  19: ["HTTPS", "GET /callback?state=<state>&session_state=…&iss=…&code=<code> HTTP/2 · Host: app.<도메인> · Cookie: login_tx=…"],
  20: ["HTTP",  "GET /callback?state=<state>&…&code=<code> HTTP/1.1 · Host: app.<도메인> · Cookie: login_tx=… · X-Forwarded-Proto: https"],
  21: ["HTTP",  "POST /realms/demo/protocol/openid-connect/token HTTP/1.1 · Host: <인증 VM 사설 IP>:8080 · " +
                "Authorization: Basic <client_id:client_secret> · Content-Type: application/x-www-form-urlencoded · " +
                "grant_type=authorization_code&code=<code>&redirect_uri=https%3A%2F%2Fapp.<도메인>%2Fcallback&code_verifier=<code_verifier>"],
  22: ["HTTP",  "HTTP/1.1 200 OK (application/json) {\"access_token\":\"eyJ…\",\"expires_in\":300,\"refresh_expires_in\":1800," +
                "\"refresh_token\":\"eyJ…\",\"token_type\":\"Bearer\",\"id_token\":\"eyJ…\",\"scope\":\"openid profile\"}"],
  23: ["HTTP",  "GET /realms/demo/protocol/openid-connect/certs HTTP/1.1 · Host: <인증 VM 사설 IP>:8080"],
  24: ["HTTP",  "HTTP/1.1 200 OK (application/json) {\"keys\":[{\"kid\":\"…\",\"kty\":\"RSA\",\"alg\":\"RS256\",\"use\":\"sig\",\"n\":\"…\",\"e\":\"AQAB\"}]}"],
  25: ["PGSQL", "Parse·Bind·Execute  INSERT INTO sessions (id, user_sub, expires_at) VALUES ($1, $2, now() + interval '8 hours')"],
  26: ["PGSQL", "CommandComplete INSERT 0 1"],
  27: ["HTTP",  "HTTP/1.1 302 Found · Location: / · Set-Cookie: sid=<세션 ID>; HttpOnly; Secure; SameSite=Lax; Path=/ · Set-Cookie: login_tx=; Max-Age=0"],
  28: ["HTTPS", "HTTP/2 302 · location: / · set-cookie: sid=<세션 ID>; HttpOnly; Secure; SameSite=Lax"],
  29: ["HTTPS", "GET /api/orders HTTP/2 · Host: app.<도메인> · Cookie: sid=<세션 ID> · Accept: application/json"],
  30: ["HTTP",  "GET /api/orders HTTP/1.1 · Host: app.<도메인> · Cookie: sid=<세션 ID> · X-Forwarded-Proto: https"],
  31: ["PGSQL", "Parse·Bind·Execute  SELECT user_sub, expires_at FROM sessions WHERE id = $1 AND expires_at > now()"],
  32: ["PGSQL", "RowDescription · DataRow ×1 (user_sub, expires_at) · CommandComplete SELECT 1"],
  33: ["PGSQL", "Parse·Bind·Execute  SELECT id, item, amount, ordered_at FROM orders WHERE user_sub = $1 ORDER BY ordered_at DESC LIMIT 20"],
  34: ["PGSQL", "RowDescription · DataRow ×20 (id, item, amount, ordered_at) · CommandComplete SELECT 20"],
  35: ["HTTP",  "HTTP/1.1 200 OK (application/json) {\"orders\":[{\"id\":1042,\"item\":\"…\",\"amount\":12000,\"ordered_at\":\"2026-11-05T09:12:00+09:00\"},…]}"],
  36: ["HTTPS", "HTTP/2 200 · content-type: application/json · {\"orders\":[…20건…]}"]
} };
