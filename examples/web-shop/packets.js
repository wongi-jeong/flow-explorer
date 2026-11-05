// 단계마다 실제로 오가는 패킷: PKT[구성도][번호] = [프로토콜, 내용]. 내용은 글자 그대로 보이므로 <도메인> 같은 자리표시를 그대로 쓴다.
// 비밀값과 토큰은 넣지 않고 … 로 줄인다. 프로토콜이 META.inproc(JVM)이면 "같은 프로세스 안의 호출"로 보인다.
var PKT = {
  svc: {
    1:  ["HTTPS", "GET / HTTP/2 · Host: shop.<도메인> · Accept: text/html"],
    2:  ["HTTPS", "HTTP/2 200 · content-type: text/html; charset=utf-8 · cache-control: public, max-age=300 · cf-cache-status: HIT · age: 42"],
    3:  ["HTTPS", "GET /api/products?category=shoes&page=1 HTTP/2 · Host: shop.<도메인> · Accept: application/json"],
    4:  ["HTTPS", "GET /api/products?category=shoes&page=1 HTTP/1.1 · Host: shop.<도메인> · CF-Connecting-IP: <사용자 IP> · X-Forwarded-Proto: https"],
    5:  ["HTTP",  "GET /api/products?category=shoes&page=1 HTTP/1.1 · X-Forwarded-For: <사용자 IP> · X-Request-Id: 9f3c…"],
    6:  ["Redis", "GET products:shoes:p1"],
    7:  ["Redis", "$-1 (nil)"],
    8:  ["PGSQL", "Parse·Bind·Execute  SELECT id, name, price, thumbnail_url FROM products WHERE category = $1 AND on_sale ORDER BY ranking LIMIT 20 OFFSET 0"],
    9:  ["PGSQL", "RowDescription · DataRow ×20 · CommandComplete SELECT 20"],
    10: ["Redis", "SET products:shoes:p1 <목록 JSON> EX 60"],
    11: ["Redis", "+OK"],
    12: ["HTTP",  "HTTP/1.1 200 OK · Content-Type: application/json · Cache-Control: no-store · {\"items\":[…20건],\"page\":1}"],
    13: ["HTTPS", "HTTP/1.1 200 OK · Content-Type: application/json · Cache-Control: no-store"],
    14: ["HTTPS", "HTTP/2 200 · content-type: application/json · cf-cache-status: DYNAMIC"],
    15: ["HTTPS", "POST /api/orders HTTP/2 · Host: shop.<도메인> · Cookie: sid=… · Idempotency-Key: 7d1e… · " +
                  "{\"items\":[{\"productId\":31,\"qty\":1},{\"productId\":58,\"qty\":1}],\"paymentMethodId\":\"pm_…\"}"],
    16: ["HTTPS", "POST /api/orders HTTP/1.1 · Host: shop.<도메인> · Cookie: sid=… · Idempotency-Key: 7d1e… · CF-Connecting-IP: <사용자 IP>"],
    17: ["HTTP",  "POST /api/orders HTTP/1.1 · X-Forwarded-For: <사용자 IP> · Cookie: sid=… · Idempotency-Key: 7d1e…"],
    18: ["Redis", "GET session:<sid>"],
    19: ["Redis", "{\"userId\":4821,\"expiresAt\":\"…\"}"],
    20: ["JVM",   "paymentService.charge(orderDraft, \"pm_…\", idempotencyKey)"],
    21: ["HTTPS", "POST /v1/payment_intents HTTP/1.1 · Host: api.stripe.com · Authorization: Bearer … · Idempotency-Key: 7d1e… · " +
                  "amount=59000&currency=krw&payment_method=pm_…&confirm=true"],
    22: ["HTTPS", "HTTP/1.1 200 OK · {\"id\":\"pi_…\",\"object\":\"payment_intent\",\"status\":\"succeeded\",\"amount\":59000,\"currency\":\"krw\"}"],
    23: ["JVM",   "return PaymentResult(SUCCEEDED, \"pi_…\")"],
    24: ["PGSQL", "BEGIN · INSERT INTO orders (user_id, total, status) VALUES ($1, $2, 'PAID') RETURNING id · INSERT INTO order_items … · " +
                  "INSERT INTO payments (order_id, intent_id, amount) … · INSERT INTO outbox (topic, payload) VALUES ('order.paid', $1) · COMMIT"],
    25: ["PGSQL", "CommandComplete INSERT 0 1 · INSERT 0 2 · INSERT 0 1 · INSERT 0 1 · COMMIT · ReadyForQuery"],
    26: ["HTTP",  "HTTP/1.1 201 Created · Location: /api/orders/1042 · {\"orderId\":1042,\"status\":\"PAID\"}"],
    27: ["HTTPS", "HTTP/1.1 201 Created · Location: /api/orders/1042"],
    28: ["HTTPS", "HTTP/2 201 · location: /api/orders/1042 · content-type: application/json"],
    29: ["HTTPS", "POST /webhooks/stripe HTTP/1.1 · Host: shop.<도메인> · Stripe-Signature: t=…,v1=… · " +
                  "{\"type\":\"payment_intent.succeeded\",\"data\":{\"object\":{\"id\":\"pi_…\"}}}"],
    30: ["HTTPS", "POST /webhooks/stripe HTTP/1.1 · Host: shop.<도메인> · Stripe-Signature: t=…,v1=… · CF-Connecting-IP: <결제 서비스 IP>"],
    31: ["HTTP",  "POST /webhooks/stripe HTTP/1.1 · X-Forwarded-For: <결제 서비스 IP> · Stripe-Signature: t=…,v1=…"],
    32: ["JVM",   "webhookVerifier.verify(rawBody, \"t=…,v1=…\")"],
    33: ["JVM",   "return Event(\"payment_intent.succeeded\", \"pi_…\")"],
    34: ["PGSQL", "UPDATE payments SET confirmed_at = now() WHERE intent_id = $1 AND confirmed_at IS NULL"],
    35: ["PGSQL", "CommandComplete UPDATE 1"],
    36: ["HTTP",  "HTTP/1.1 200 OK · Content-Length: 0"],
    37: ["HTTPS", "HTTP/1.1 200 OK · Content-Length: 0"],
    38: ["HTTPS", "HTTP/1.1 200 OK"]
  },
  job: {
    1:  ["PGSQL", "BEGIN · SELECT id, topic, payload FROM outbox WHERE sent_at IS NULL ORDER BY id LIMIT 100 FOR UPDATE SKIP LOCKED"],
    2:  ["PGSQL", "RowDescription · DataRow ×1 (5531, order.paid, {\"orderId\":1042}) · CommandComplete SELECT 1"],
    3:  ["AMQP",  "basic.publish exchange=orders routing-key=order.paid · delivery-mode=2 · message-id=outbox-5531 · {\"orderId\":1042}"],
    4:  ["AMQP",  "basic.ack delivery-tag=1"],
    5:  ["PGSQL", "UPDATE outbox SET sent_at = now() WHERE id = $1 · COMMIT"],
    6:  ["PGSQL", "CommandComplete UPDATE 1 · COMMIT"],
    7:  ["AMQP",  "basic.deliver consumer-tag=receipt-worker delivery-tag=88 routing-key=order.paid · message-id=outbox-5531 · {\"orderId\":1042}"],
    8:  ["PGSQL", "SELECT o.id, o.total, u.email, i.name, i.qty, i.price FROM orders o JOIN users u ON u.id = o.user_id " +
                  "JOIN order_items i ON i.order_id = o.id WHERE o.id = $1"],
    9:  ["PGSQL", "RowDescription · DataRow ×2 · CommandComplete SELECT 2"],
    10: ["HTTPS", "PUT /receipts/2026/11/1042.pdf HTTP/1.1 · Host: files.<내부 도메인>:9000 · " +
                  "Authorization: AWS4-HMAC-SHA256 Credential=…, Signature=… · Content-Type: application/pdf · Content-Length: 48213"],
    11: ["HTTPS", "HTTP/1.1 200 OK · ETag: \"5d41…\""],
    12: ["HTTPS", "POST /v3/mail/send HTTP/1.1 · Host: api.sendgrid.com · Authorization: Bearer … · " +
                  "{\"personalizations\":[{\"to\":[{\"email\":\"<고객 메일>\"}],\"dynamic_template_data\":{\"orderId\":1042}}]," +
                  "\"template_id\":\"d-…\",\"attachments\":[{\"filename\":\"receipt-1042.pdf\",\"content\":\"…\"}]}"],
    13: ["HTTPS", "HTTP/1.1 202 Accepted · X-Message-Id: …"],
    14: ["AMQP",  "basic.ack delivery-tag=88"]
  },
  ci: {
    1:  ["HTTPS", "PUT /repos/<조직>/shop/pulls/128/merge HTTP/2 · Host: api.github.com · Authorization: Bearer … · {\"merge_method\":\"squash\"}"],
    2:  ["HTTPS", "HTTP/2 200 · {\"sha\":\"<커밋>\",\"merged\":true,\"message\":\"Pull Request successfully merged\"}"],
    3:  ["HTTPS", "GET /message?sessionId=…&status=Online HTTP/1.1 · Host: broker.actions.githubusercontent.com · Authorization: Bearer …"],
    4:  ["HTTPS", "HTTP/1.1 200 OK · {\"messageType\":\"RunnerJobRequest\",\"body\":\"…\"} (deploy 작업, main@<커밋>)"],
    5:  ["HTTPS", "POST /<조직>/shop.git/git-upload-pack HTTP/1.1 · Host: github.com · Authorization: Basic … · want <커밋> · deepen 1"],
    6:  ["HTTPS", "HTTP/1.1 200 OK · Content-Type: application/x-git-upload-pack-result · packfile"],
    7:  ["HTTPS", "PUT /v2/<조직>/shop-api/manifests/<커밋> HTTP/1.1 · Host: ghcr.io · Authorization: Bearer … · " +
                  "Content-Type: application/vnd.oci.image.manifest.v1+json"],
    8:  ["HTTPS", "HTTP/1.1 201 Created · Docker-Content-Digest: sha256:… · Location: /v2/<조직>/shop-api/manifests/sha256:…"],
    9:  ["HTTPS", "POST /apis/batch/v1/namespaces/shop/jobs HTTP/1.1 · Host: <클러스터 API>:6443 · Authorization: Bearer … · " +
                  "{\"kind\":\"Job\",\"metadata\":{\"name\":\"migrate-<커밋>\"},\"spec\":{… \"image\":\"ghcr.io/<조직>/shop-api:<커밋>\",\"args\":[\"migrate\"]}}"],
    10: ["HTTPS", "HTTP/1.1 201 Created · {\"kind\":\"Job\",\"metadata\":{\"name\":\"migrate-<커밋>\",\"uid\":\"…\"}}"],
    11: ["HTTPS", "GET /v2/<조직>/shop-api/manifests/<커밋> HTTP/1.1 · Host: ghcr.io · Authorization: Bearer … · " +
                  "Accept: application/vnd.oci.image.manifest.v1+json"],
    12: ["HTTPS", "HTTP/1.1 200 OK · Docker-Content-Digest: sha256:… · (이어서 없는 레이어만 GET /v2/…/blobs/sha256:…)"],
    13: ["HTTPS", "GET /v1/database/creds/shop-migrate HTTP/1.1 · Host: vault.<내부 도메인>:8200 · X-Vault-Token: …"],
    14: ["HTTPS", "HTTP/1.1 200 OK · {\"lease_id\":\"database/creds/shop-migrate/…\",\"lease_duration\":900," +
                  "\"data\":{\"username\":\"v-k8s-shop-migrate-…\",\"password\":\"…\"}}"],
    15: ["PGSQL", "StartupMessage user=v-k8s-shop-migrate-… · SELECT … FROM flyway_schema_history · " +
                  "ALTER TABLE orders ADD COLUMN gift_message text · INSERT INTO flyway_schema_history …"],
    16: ["PGSQL", "CommandComplete ALTER TABLE · INSERT 0 1 · ReadyForQuery"],
    17: ["HTTPS", "PATCH /apis/apps/v1/namespaces/shop/deployments/api HTTP/1.1 · Content-Type: application/strategic-merge-patch+json · " +
                  "{\"spec\":{\"template\":{\"spec\":{\"containers\":[{\"name\":\"api\",\"image\":\"ghcr.io/<조직>/shop-api:<커밋>\"}]}}}}"],
    18: ["HTTPS", "HTTP/1.1 200 OK · {\"kind\":\"Deployment\",\"metadata\":{\"name\":\"api\",\"generation\":58}}"],
    19: ["HTTP",  "GET /actuator/health/readiness HTTP/1.1 · Host: <파드 IP>:8080 · User-Agent: kube-probe/…"],
    20: ["HTTP",  "HTTP/1.1 200 OK · {\"status\":\"UP\"}"],
    21: ["HTTPS", "GET /apis/apps/v1/namespaces/shop/deployments/api HTTP/1.1 · Authorization: Bearer … (kubectl rollout status)"],
    22: ["HTTPS", "HTTP/1.1 200 OK · {\"status\":{\"observedGeneration\":58,\"replicas\":3,\"updatedReplicas\":3,\"availableReplicas\":3}}"]
  },
  obs: {
    1:  ["gRPC",  "POST /opentelemetry.proto.collector.logs.v1.LogsService/Export HTTP/2 · content-type: application/grpc · " +
                  "resource: service.name=shop-api · log_records ×128"],
    2:  ["gRPC",  "HTTP/2 200 · grpc-status: 0 · ExportLogsServiceResponse {}"],
    3:  ["HTTP",  "POST /loki/api/v1/push HTTP/1.1 · Content-Type: application/x-protobuf · Content-Encoding: snappy · " +
                  "streams: {service_name=\"shop-api\"} · 128줄"],
    4:  ["HTTP",  "HTTP/1.1 204 No Content"],
    5:  ["HTTP",  "GET /actuator/prometheus HTTP/1.1 · Host: <파드 IP>:8080 · Accept: text/plain;version=0.0.4 · User-Agent: Prometheus/…"],
    6:  ["HTTP",  "HTTP/1.1 200 OK · Content-Type: text/plain;version=0.0.4 · " +
                  "http_server_requests_seconds_count{uri=\"/api/orders\",status=\"201\"} 1873 · jvm_memory_used_bytes{area=\"heap\"} 3.1E8 …"],
    7:  ["HTTP",  "GET /metrics HTTP/1.1 · Host: <DB VM>:9100 · User-Agent: Prometheus/…"],
    8:  ["HTTP",  "HTTP/1.1 200 OK · node_filesystem_avail_bytes{mountpoint=\"/var/lib/postgresql\"} 9.6E9 · " +
                  "node_filesystem_size_bytes{mountpoint=\"/var/lib/postgresql\"} 1.07E11 …"],
    9:  ["HTTP",  "POST /api/v2/alerts HTTP/1.1 · Host: <관측 VM>:9093 · " +
                  "[{\"labels\":{\"alertname\":\"DiskAlmostFull\",\"instance\":\"db-vm:9100\",\"severity\":\"warning\"}," +
                  "\"annotations\":{\"summary\":\"DB 디스크 사용률 91%\"}}]"],
    10: ["HTTP",  "HTTP/1.1 200 OK"],
    11: ["HTTPS", "POST /services/T…/B…/… HTTP/1.1 · Host: hooks.slack.com · Content-Type: application/json · " +
                  "{\"text\":\"[FIRING:1] DiskAlmostFull db-vm:9100 · DB 디스크 사용률 91%\"}"],
    12: ["HTTPS", "HTTP/1.1 200 OK · ok"]
  }
};
