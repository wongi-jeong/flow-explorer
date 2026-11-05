// 일본어 번역: TR.ja[한국어 원문] = 일본어. 원문을 고치면 이 파일의 같은 줄도 고친다(번역이 없으면 원문이 그대로 나온다).
TR.ja = {
  "사용자 브라우저":
    "ユーザーのブラウザ",
  "브라우저":
    "ブラウザ",
  ":443 · TLS 종료":
    ":443 · TLS終端",
  "nginx (리버스 프록시)":
    "nginx（リバースプロキシ）",
  "앱 서버":
    "アプリサーバー",
  "앱 서버 (Node.js)":
    "アプリサーバー（Node.js）",
  "앱":
    "アプリ",
  "Keycloak (ID 공급자)":
    "Keycloak（IDプロバイダー）",
  "PostgreSQL (DB 서버)":
    "PostgreSQL（DBサーバー）",
  "클라우드 VPC":
    "クラウドVPC",
  "웹 VM":
    "Web VM",
  "인증 VM":
    "認証VM",
  "사용자":
    "ユーザー",
  "인터넷 → 웹 VM 공인 IP · TCP 443":
    "インターネット → Web VMのグローバルIP · TCP 443",
  "인터넷 → 웹 VM 443":
    "インターネット → Web VM 443",
  "브라우저가 앱(app.<도메인>)과 로그인 화면(auth.<도메인>)을 HTTPS로 여는 길입니다. 두 도메인 모두 웹 VM의 nginx가 받습니다.":
    "ブラウザがアプリ（app.<ドメイン>）とログイン画面（auth.<ドメイン>）をHTTPSで開く経路です。どちらのドメインもWeb VMのnginxが受けます。",
  "웹 VM → 인증 VM 사설 IP · TCP 8080":
    "Web VM → 認証VMのプライベートIP · TCP 8080",
  "웹 VM → 인증 VM 8080":
    "Web VM → 認証VM 8080",
  "nginx가 로그인 화면 요청을 Keycloak으로 넘기고, 앱 서버가 토큰과 서명 키를 받는 길입니다. Keycloak은 인터넷에 직접 열지 않습니다.":
    "nginxがログイン画面のリクエストをKeycloakへ転送し、アプリサーバーがトークンと署名鍵を受け取る経路です。Keycloakはインターネットに直接公開しません。",
  "웹 VM → DB VM 사설 IP · TCP 5432":
    "Web VM → DB VMのプライベートIP · TCP 5432",
  "웹 VM → DB VM 5432":
    "Web VM → DB VM 5432",
  "앱 서버가 app DB의 세션과 주문을 읽고 쓰는 길입니다.":
    "アプリサーバーがapp DBのセッションと注文を読み書きする経路です。",
  "인증 VM → DB VM 사설 IP · TCP 5432":
    "認証VM → DB VMのプライベートIP · TCP 5432",
  "인증 VM → DB VM 5432":
    "認証VM → DB VM 5432",
  "Keycloak이 keycloak DB에서 사용자와 비밀번호 해시를 읽는 길입니다. DB VM은 웹 VM과 인증 VM의 사설 IP만 받습니다.":
    "Keycloakがkeycloak DBからユーザーとパスワードハッシュを読む経路です。DB VMはWeb VMと認証VMのプライベートIPからの接続だけを受け付けます。",
  "처음 접속할 때":
    "初回アクセス時",
  "로그인할 때":
    "ログイン時",
  "API를 부를 때":
    "API呼び出し時",
  "첫 화면":
    "トップ画面",
  "세션 쿠키가 없어 앱 서버가 로그인 안내 화면을 돌려줍니다.":
    "セッションCookieがないため、アプリサーバーがログイン案内画面を返します。",
  "Keycloak으로 보내기":
    "Keycloakへ送る",
  "앱 서버가 state와 PKCE 값을 만들고 브라우저를 Keycloak 로그인 주소로 보냅니다.":
    "アプリサーバーがstateとPKCEの値を作り、ブラウザをKeycloakのログインURLへ送ります。",
  "로그인 화면":
    "ログイン画面",
  "nginx가 auth 도메인 요청을 인증 VM의 Keycloak으로 넘깁니다.":
    "nginxがauthドメインへのリクエストを認証VMのKeycloakへ転送します。",
  "ID·비밀번호 확인":
    "ID・パスワード確認",
  "Keycloak이 DB의 비밀번호 해시로 확인하고 code를 붙여 앱으로 돌려보냅니다.":
    "KeycloakがDBのパスワードハッシュで確認し、codeを付けてアプリへ戻します。",
  "code를 토큰으로":
    "codeをトークンに交換",
  "앱 서버가 code와 code_verifier로 토큰을 받고 서명 키로 ID 토큰을 확인합니다.":
    "アプリサーバーがcodeとcode_verifierでトークンを受け取り、署名鍵でIDトークンを検証します。",
  "세션 만들기":
    "セッション作成",
  "앱 서버가 세션을 DB에 저장하고 세션 쿠키를 붙여 첫 화면으로 보냅니다.":
    "アプリサーバーがセッションをDBに保存し、セッションCookieを付けてトップ画面へ送ります。",
  "세션 확인":
    "セッション確認",
  "쿠키의 세션 ID로 로그인한 사용자를 찾습니다.":
    "CookieのセッションIDからログイン中のユーザーを特定します。",
  "주문 조회와 응답":
    "注文の照会と応答",
  "그 사용자의 주문을 읽어 JSON으로 돌려줍니다.":
    "そのユーザーの注文を読み、JSONで返します。",
  "GET / HTTP/2 · Host: app.<도메인> · Accept: text/html":
    "GET / HTTP/2 · Host: app.<ドメイン> · Accept: text/html",
  "GET / HTTP/1.1 · Host: app.<도메인> · X-Forwarded-For: <브라우저 IP> · X-Forwarded-Proto: https":
    "GET / HTTP/1.1 · Host: app.<ドメイン> · X-Forwarded-For: <ブラウザのIP> · X-Forwarded-Proto: https",
  "GET /login HTTP/2 · Host: app.<도메인>":
    "GET /login HTTP/2 · Host: app.<ドメイン>",
  "GET /login HTTP/1.1 · Host: app.<도메인> · X-Forwarded-Proto: https":
    "GET /login HTTP/1.1 · Host: app.<ドメイン> · X-Forwarded-Proto: https",
  "HTTP/1.1 302 Found · Location: https://auth.<도메인>/realms/demo/protocol/openid-connect/auth?response_type=code&client_id=web&redirect_uri=https%3A%2F%2Fapp.<도메인>%2Fcallback&scope=openid%20profile&state=<state>&code_challenge=<code_challenge>&code_challenge_method=S256 · Set-Cookie: login_tx=<서명한 state·code_verifier>; HttpOnly; Secure; SameSite=Lax; Max-Age=600":
    "HTTP/1.1 302 Found · Location: https://auth.<ドメイン>/realms/demo/protocol/openid-connect/auth?response_type=code&client_id=web&redirect_uri=https%3A%2F%2Fapp.<ドメイン>%2Fcallback&scope=openid%20profile&state=<state>&code_challenge=<code_challenge>&code_challenge_method=S256 · Set-Cookie: login_tx=<署名済みのstate・code_verifier>; HttpOnly; Secure; SameSite=Lax; Max-Age=600",
  "HTTP/2 302 · location: https://auth.<도메인>/realms/demo/protocol/openid-connect/auth?… · set-cookie: login_tx=…":
    "HTTP/2 302 · location: https://auth.<ドメイン>/realms/demo/protocol/openid-connect/auth?… · set-cookie: login_tx=…",
  "GET /realms/demo/protocol/openid-connect/auth?response_type=code&client_id=web&redirect_uri=https%3A%2F%2Fapp.<도메인>%2Fcallback&scope=openid%20profile&state=<state>&code_challenge=<code_challenge>&code_challenge_method=S256 HTTP/2 · Host: auth.<도메인>":
    "GET /realms/demo/protocol/openid-connect/auth?response_type=code&client_id=web&redirect_uri=https%3A%2F%2Fapp.<ドメイン>%2Fcallback&scope=openid%20profile&state=<state>&code_challenge=<code_challenge>&code_challenge_method=S256 HTTP/2 · Host: auth.<ドメイン>",
  "GET /realms/demo/protocol/openid-connect/auth?… HTTP/1.1 · Host: auth.<도메인> · X-Forwarded-Proto: https":
    "GET /realms/demo/protocol/openid-connect/auth?… HTTP/1.1 · Host: auth.<ドメイン> · X-Forwarded-Proto: https",
  "HTTP/2 200 · content-type: text/html;charset=utf-8 (로그인 폼)":
    "HTTP/2 200 · content-type: text/html;charset=utf-8 （ログインフォーム）",
  "POST /realms/demo/login-actions/authenticate?session_code=…&execution=…&client_id=web&tab_id=… HTTP/2 · Content-Type: application/x-www-form-urlencoded · username=<ID>&password=<비밀번호>":
    "POST /realms/demo/login-actions/authenticate?session_code=…&execution=…&client_id=web&tab_id=… HTTP/2 · Content-Type: application/x-www-form-urlencoded · username=<ID>&password=<パスワード>",
  "POST /realms/demo/login-actions/authenticate?… HTTP/1.1 · Host: auth.<도메인> · username=<ID>&password=<비밀번호>":
    "POST /realms/demo/login-actions/authenticate?… HTTP/1.1 · Host: auth.<ドメイン> · username=<ID>&password=<パスワード>",
  "RowDescription · DataRow ×1 (user_entity) · DataRow ×1 (credential: 비밀번호 해시) · CommandComplete SELECT 1":
    "RowDescription · DataRow ×1 (user_entity) · DataRow ×1 (credential: パスワードハッシュ) · CommandComplete SELECT 1",
  "HTTP/1.1 302 Found · Location: https://app.<도메인>/callback?state=<state>&session_state=…&iss=https%3A%2F%2Fauth.<도메인>%2Frealms%2Fdemo&code=<code> · Set-Cookie: KEYCLOAK_IDENTITY=…; KEYCLOAK_SESSION=…":
    "HTTP/1.1 302 Found · Location: https://app.<ドメイン>/callback?state=<state>&session_state=…&iss=https%3A%2F%2Fauth.<ドメイン>%2Frealms%2Fdemo&code=<code> · Set-Cookie: KEYCLOAK_IDENTITY=…; KEYCLOAK_SESSION=…",
  "HTTP/2 302 · location: https://app.<도메인>/callback?state=<state>&…&code=<code> · set-cookie: KEYCLOAK_IDENTITY=…":
    "HTTP/2 302 · location: https://app.<ドメイン>/callback?state=<state>&…&code=<code> · set-cookie: KEYCLOAK_IDENTITY=…",
  "GET /callback?state=<state>&session_state=…&iss=…&code=<code> HTTP/2 · Host: app.<도메인> · Cookie: login_tx=…":
    "GET /callback?state=<state>&session_state=…&iss=…&code=<code> HTTP/2 · Host: app.<ドメイン> · Cookie: login_tx=…",
  "GET /callback?state=<state>&…&code=<code> HTTP/1.1 · Host: app.<도메인> · Cookie: login_tx=… · X-Forwarded-Proto: https":
    "GET /callback?state=<state>&…&code=<code> HTTP/1.1 · Host: app.<ドメイン> · Cookie: login_tx=… · X-Forwarded-Proto: https",
  "POST /realms/demo/protocol/openid-connect/token HTTP/1.1 · Host: <인증 VM 사설 IP>:8080 · Authorization: Basic <client_id:client_secret> · Content-Type: application/x-www-form-urlencoded · grant_type=authorization_code&code=<code>&redirect_uri=https%3A%2F%2Fapp.<도메인>%2Fcallback&code_verifier=<code_verifier>":
    "POST /realms/demo/protocol/openid-connect/token HTTP/1.1 · Host: <認証VMのプライベートIP>:8080 · Authorization: Basic <client_id:client_secret> · Content-Type: application/x-www-form-urlencoded · grant_type=authorization_code&code=<code>&redirect_uri=https%3A%2F%2Fapp.<ドメイン>%2Fcallback&code_verifier=<code_verifier>",
  "GET /realms/demo/protocol/openid-connect/certs HTTP/1.1 · Host: <인증 VM 사설 IP>:8080":
    "GET /realms/demo/protocol/openid-connect/certs HTTP/1.1 · Host: <認証VMのプライベートIP>:8080",
  "HTTP/1.1 302 Found · Location: / · Set-Cookie: sid=<세션 ID>; HttpOnly; Secure; SameSite=Lax; Path=/ · Set-Cookie: login_tx=; Max-Age=0":
    "HTTP/1.1 302 Found · Location: / · Set-Cookie: sid=<セッションID>; HttpOnly; Secure; SameSite=Lax; Path=/ · Set-Cookie: login_tx=; Max-Age=0",
  "HTTP/2 302 · location: / · set-cookie: sid=<세션 ID>; HttpOnly; Secure; SameSite=Lax":
    "HTTP/2 302 · location: / · set-cookie: sid=<セッションID>; HttpOnly; Secure; SameSite=Lax",
  "GET /api/orders HTTP/2 · Host: app.<도메인> · Cookie: sid=<세션 ID> · Accept: application/json":
    "GET /api/orders HTTP/2 · Host: app.<ドメイン> · Cookie: sid=<セッションID> · Accept: application/json",
  "GET /api/orders HTTP/1.1 · Host: app.<도메인> · Cookie: sid=<세션 ID> · X-Forwarded-Proto: https":
    "GET /api/orders HTTP/1.1 · Host: app.<ドメイン> · Cookie: sid=<セッションID> · X-Forwarded-Proto: https",
  "HTTP/2 200 · content-type: application/json · {\"orders\":[…20건…]}":
    "HTTP/2 200 · content-type: application/json · {\"orders\":[…20件…]}",
  "전체 흐름":
    "全体フロー",
  "접속부터 API 호출까지 36단계":
    "アクセスからAPI呼び出しまで36ステップ",
  "브라우저가 처음 접속해 로그인하고 API를 부르기까지 36단계를 차례로 봅니다. nginx가 앱과 로그인 화면을 모두 받고, 앱 서버와 Keycloak은 DB VM의 PostgreSQL을 각자의 DB로 씁니다.":
    "ブラウザが初めてアクセスしてログインし、APIを呼び出すまでの36ステップを順に見ます。nginxがアプリとログイン画面の両方を受け、アプリサーバーとKeycloakはDB VMのPostgreSQLをそれぞれ自分のDBとして使います。",
  "샘플 웹 서비스":
    "サンプルWebサービス",
  "첫 화면 요청":
    "トップ画面のリクエスト",
  "브라우저가 <code>https://app.&lt;도메인&gt;/</code>을 엽니다. 아직 세션 쿠키가 없습니다.":
    "ブラウザが<code>https://app.&lt;ドメイン&gt;/</code>を開きます。まだセッションCookieはありません。",
  "GET / (app 도메인)":
    "GET /（appドメイン）",
  "nginx가 TLS를 풀고 <code>app.&lt;도메인&gt;</code> 요청을 같은 VM의 앱 서버로 넘깁니다. 원래 주소와 프로토콜은 <code>X-Forwarded-*</code> 헤더에 담습니다.":
    "nginxがTLSを終端し、<code>app.&lt;ドメイン&gt;</code>へのリクエストを同じVMのアプリサーバーへ転送します。元のアドレスとプロトコルは<code>X-Forwarded-*</code>ヘッダーに入れます。",
  "로그인 안내 화면":
    "ログイン案内画面",
  "세션 쿠키가 없으므로 앱 서버가 로그인 버튼이 있는 첫 화면을 돌려줍니다.":
    "セッションCookieがないため、アプリサーバーはログインボタンのあるトップ画面を返します。",
  "nginx가 응답을 HTTPS로 브라우저에 돌려줍니다.":
    "nginxがレスポンスをHTTPSでブラウザへ返します。",
  "로그인 시작":
    "ログイン開始",
  "사용자가 로그인 버튼을 누릅니다.":
    "ユーザーがログインボタンを押します。",
  "nginx가 요청을 앱 서버로 넘깁니다.":
    "nginxがリクエストをアプリサーバーへ転送します。",
  "Keycloak으로 이동 (302)":
    "Keycloakへリダイレクト（302）",
  "앱 서버가 <code>state</code>와 PKCE <code>code_verifier</code>를 만들어 서명한 임시 쿠키에 담고, <code>code_challenge</code>(S256)를 붙인 Keycloak 로그인 주소로 보냅니다.":
    "アプリサーバーが<code>state</code>とPKCEの<code>code_verifier</code>を作って署名付きの一時Cookieに入れ、<code>code_challenge</code>（S256）を付けたKeycloakのログインURLへ送ります。",
  "302 Found → Keycloak 인가 엔드포인트":
    "302 Found → Keycloakの認可エンドポイント",
  "브라우저가 임시 쿠키를 저장하고 <code>Location</code>의 <code>auth.&lt;도메인&gt;</code> 주소로 이동합니다.":
    "ブラウザは一時Cookieを保存し、<code>Location</code>にある<code>auth.&lt;ドメイン&gt;</code>のURLへ移動します。",
  "302 Found + 임시 쿠키":
    "302 Found + 一時Cookie",
  "로그인 화면 요청":
    "ログイン画面のリクエスト",
  "브라우저가 <code>auth.&lt;도메인&gt;</code>의 인가 엔드포인트를 엽니다. 이 도메인도 같은 nginx가 받습니다.":
    "ブラウザが<code>auth.&lt;ドメイン&gt;</code>の認可エンドポイントを開きます。このドメインも同じnginxが受けます。",
  "nginx가 <code>auth.&lt;도메인&gt;</code> 요청을 인증 VM의 Keycloak으로 넘깁니다. Keycloak은 인터넷에 직접 열려 있지 않습니다.":
    "nginxが<code>auth.&lt;ドメイン&gt;</code>へのリクエストを認証VMのKeycloakへ転送します。Keycloakはインターネットに直接公開されていません。",
  "Keycloak이 <code>client_id</code>와 <code>redirect_uri</code>가 등록한 값과 맞는지 확인하고 로그인 화면을 돌려줍니다. <code>code_challenge</code>는 로그인 세션에 기억해 둡니다.":
    "Keycloakは<code>client_id</code>と<code>redirect_uri</code>が登録済みの値と一致するか確認し、ログイン画面を返します。<code>code_challenge</code>はログインセッションに記録しておきます。",
  "nginx가 로그인 화면을 브라우저에 돌려줍니다.":
    "nginxがログイン画面をブラウザへ返します。",
  "ID·비밀번호 제출":
    "ID・パスワードの送信",
  "사용자가 ID와 비밀번호를 입력해 제출합니다.":
    "ユーザーがIDとパスワードを入力して送信します。",
  "nginx가 제출한 폼을 Keycloak으로 넘깁니다.":
    "nginxが送信されたフォームをKeycloakへ転送します。",
  "사용자 조회":
    "ユーザーの照会",
  "Keycloak이 <code>keycloak</code> DB에서 사용자와 비밀번호 해시를 읽습니다.":
    "Keycloakが<code>keycloak</code> DBからユーザーとパスワードハッシュを読みます。",
  "사용자·비밀번호 해시":
    "ユーザー・パスワードハッシュ",
  "DB가 사용자 행과 비밀번호 해시를 돌려줍니다. Keycloak은 입력한 비밀번호를 같은 방식으로 해시해 비교합니다.":
    "DBがユーザーの行とパスワードハッシュを返します。Keycloakは入力されたパスワードを同じ方式でハッシュして比較します。",
  "사용자 1행 · 비밀번호 해시 1행":
    "ユーザー1行 · パスワードハッシュ1行",
  "앱으로 돌아가기 (302 + code)":
    "アプリへ戻る（302 + code）",
  "비밀번호가 맞으면 Keycloak이 로그인 세션 쿠키를 만들고, 한 번만 쓰는 <code>code</code>를 붙여 앱의 <code>redirect_uri</code>로 보냅니다.":
    "パスワードが正しければ、KeycloakはログインセッションのCookieを作り、一度だけ使える<code>code</code>を付けてアプリの<code>redirect_uri</code>へ送ります。",
  "브라우저가 <code>app.&lt;도메인&gt;/callback</code>으로 이동합니다.":
    "ブラウザが<code>app.&lt;ドメイン&gt;/callback</code>へ移動します。",
  "code 전달":
    "codeの受け渡し",
  "브라우저가 code와 state를 앱으로 가져갑니다. 8번에서 저장한 임시 쿠키도 같이 보냅니다.":
    "ブラウザがcodeとstateをアプリへ持っていきます。8番で保存した一時Cookieも一緒に送ります。",
  "nginx가 요청을 앱 서버로 넘깁니다. 앱 서버는 <code>state</code>가 임시 쿠키의 값과 같은지 확인합니다. 다르면 로그인을 멈춥니다.":
    "nginxがリクエストをアプリサーバーへ転送します。アプリサーバーは<code>state</code>が一時Cookieの値と同じか確認し、違えばログインを中止します。",
  "토큰 요청":
    "トークンのリクエスト",
  "앱 서버가 code, <code>code_verifier</code>, 클라이언트 비밀값으로 토큰 엔드포인트를 부릅니다. 이 요청은 브라우저를 거치지 않고 인증 VM으로 바로 갑니다. Keycloak의 hostname을 <code>auth.&lt;도메인&gt;</code>으로 정해 두어 내부 주소로 불러도 발급자(<code>iss</code>)가 같습니다.":
    "アプリサーバーがcode、<code>code_verifier</code>、クライアントシークレットでトークンエンドポイントを呼び出します。このリクエストはブラウザを通らず、認証VMへ直接届きます。Keycloakのhostnameを<code>auth.&lt;ドメイン&gt;</code>に設定してあるので、内部アドレスで呼び出しても発行者（<code>iss</code>）は変わりません。",
  "토큰":
    "トークン",
  "Keycloak이 <code>code_verifier</code>의 해시가 10번에서 받은 <code>code_challenge</code>와 같은지 확인하고 ID 토큰, access 토큰, refresh 토큰을 돌려줍니다.":
    "Keycloakは<code>code_verifier</code>のハッシュが10番で受け取った<code>code_challenge</code>と一致するか確認し、IDトークン、アクセストークン、リフレッシュトークンを返します。",
  "서명 키 요청":
    "署名鍵のリクエスト",
  "앱 서버가 ID 토큰 서명을 확인할 공개 키(JWKS)를 받습니다. 받은 키는 캐시해 두고 키 ID(<code>kid</code>)가 바뀔 때만 다시 받습니다.":
    "アプリサーバーがIDトークンの署名を検証するための公開鍵（JWKS）を受け取ります。受け取った鍵はキャッシュし、鍵ID（<code>kid</code>）が変わったときだけ取り直します。",
  "서명 키 (JWKS)":
    "署名鍵（JWKS）",
  "Keycloak이 공개 키 목록을 돌려줍니다. 앱 서버는 ID 토큰의 서명, 발급자(<code>iss</code>), 대상(<code>aud</code>), 만료(<code>exp</code>)를 확인합니다.":
    "Keycloakが公開鍵の一覧を返します。アプリサーバーはIDトークンの署名、発行者（<code>iss</code>）、対象（<code>aud</code>）、有効期限（<code>exp</code>）を検証します。",
  "세션 저장":
    "セッションの保存",
  "앱 서버가 새 세션 ID를 만들어 사용자 ID(<code>sub</code>)와 만료 시각을 <code>app</code> DB에 저장합니다. 토큰은 브라우저로 보내지 않습니다.":
    "アプリサーバーが新しいセッションIDを作り、ユーザーID（<code>sub</code>）と有効期限を<code>app</code> DBに保存します。トークンはブラウザへ送りません。",
  "저장 완료":
    "保存完了",
  "DB가 저장 결과를 돌려줍니다.":
    "DBが保存結果を返します。",
  "첫 화면으로 (302 + 세션 쿠키)":
    "トップ画面へ（302 + セッションCookie）",
  "앱 서버가 세션 쿠키(<code>HttpOnly</code>, <code>Secure</code>, <code>SameSite=Lax</code>)를 붙여 첫 화면으로 보냅니다. 임시 쿠키는 지웁니다.":
    "アプリサーバーがセッションCookie（<code>HttpOnly</code>、<code>Secure</code>、<code>SameSite=Lax</code>）を付けてトップ画面へ送ります。一時Cookieは削除します。",
  "브라우저가 세션 쿠키를 저장하고 첫 화면을 다시 엽니다. 이제 로그인한 화면이 보입니다.":
    "ブラウザがセッションCookieを保存し、トップ画面を開き直します。ここからはログイン後の画面が表示されます。",
  "주문 목록 요청":
    "注文一覧のリクエスト",
  "화면의 스크립트가 주문 목록 API를 부릅니다. 브라우저가 세션 쿠키를 자동으로 붙입니다.":
    "画面のスクリプトが注文一覧APIを呼び出します。ブラウザがセッションCookieを自動で付けます。",
  "앱 서버가 쿠키의 세션 ID로 세션을 찾고 만료되지 않았는지 확인합니다.":
    "アプリサーバーがCookieのセッションIDでセッションを探し、期限切れでないか確認します。",
  "세션 1건":
    "セッション1件",
  "DB가 세션 행을 돌려줍니다. 세션이 없거나 만료됐으면 앱 서버는 <code>401</code>을 돌려주고, 화면은 로그인부터 다시 시작합니다.":
    "DBがセッションの行を返します。セッションがない、または期限切れの場合、アプリサーバーは<code>401</code>を返し、画面はログインからやり直します。",
  "1행 (user_sub, expires_at)":
    "1行（user_sub, expires_at）",
  "주문 조회":
    "注文の照会",
  "앱 서버가 그 사용자의 주문을 최근 순서로 20건 읽습니다.":
    "アプリサーバーがそのユーザーの注文を新しい順に20件読みます。",
  "주문 20건":
    "注文20件",
  "DB가 주문 행을 돌려줍니다.":
    "DBが注文の行を返します。",
  "20행":
    "20行",
  "주문 목록 (JSON)":
    "注文一覧（JSON）",
  "앱 서버가 주문 목록을 JSON으로 돌려줍니다.":
    "アプリサーバーが注文一覧をJSONで返します。",
  "nginx가 응답을 브라우저에 돌려주고, 화면이 목록을 그립니다.":
    "nginxがレスポンスをブラウザへ返し、画面が一覧を描画します。",
  "세션 없이 첫 화면":
    "セッションなしでトップ画面",
  "세션 쿠키 없이 첫 화면을 열 때입니다. nginx가 TLS를 풀고 같은 VM의 앱 서버로 넘깁니다.":
    "セッションCookieなしでトップ画面を開くときです。nginxがTLSを終端し、同じVMのアプリサーバーへ転送します。",
  "OIDC 인가 코드 + PKCE":
    "OIDC認可コード + PKCE",
  "OpenID Connect 인가 코드 흐름에 PKCE를 더한 로그인입니다. 브라우저는 code만 옮기고, 토큰은 앱 서버가 Keycloak에서 직접 받아 브라우저로 내보내지 않습니다.":
    "OpenID Connectの認可コードフローにPKCEを加えたログインです。ブラウザが運ぶのはcodeだけで、トークンはアプリサーバーがKeycloakから直接受け取り、ブラウザには渡しません。",
  "세션 쿠키로 주문 조회":
    "セッションCookieで注文を照会",
  "로그인한 뒤 화면이 API를 부를 때입니다. 앱 서버는 세션 쿠키로 사용자를 찾아 그 사용자의 주문만 조회합니다.":
    "ログイン後に画面がAPIを呼び出すときです。アプリサーバーはセッションCookieでユーザーを特定し、そのユーザーの注文だけを照会します。",
  "샘플 웹 서비스 데이터 흐름":
    "サンプルWebサービスのデータフロー",
  "첫 접속 4 · 로그인 24 · API 호출 8단계":
    "初回アクセス 4 · ログイン 24 · API呼び出し 8ステップ"
};
