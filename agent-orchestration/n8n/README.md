# n8n Workflow Automation

Visual orchestrator for health checks and E2E standards. Portfolio demo of **automation engineering**.

## Install

```bash
docker run -d --name n8n \
  -p 5678:5678 \
  -v n8n_data:/home/node/.n8n \
  n8nio/n8n
```

Open: http://localhost:5678

---

## Workflow 1: Health check (every 5 minutes)

**Nodes:**

1. **Schedule Trigger** — `*/5 * * * *`
2. **HTTP Request** — `GET {{DMS_URL}}/health`
3. **HTTP Request** — `GET {{TES_URL}}/health`
4. **IF** — status code ≠ 200
5. **Send Email** or **Slack** — "Trading platform health FAIL"

**Environment variables in n8n:**

- `DMS_URL` = `http://host.docker.internal:8080` (Mac Docker → host)
- `TES_URL` = `http://host.docker.internal:8081`

---

## Workflow 2: E2E standards (every hour)

**Nodes:**

1. **Schedule Trigger** — `0 * * * *`
2. **Execute Command** (or SSH to host):
   ```bash
   /path/to/my-portfolio/agent-orchestration/e2e-standards/run_all.sh
   ```
3. **Read Binary File** — `reports/latest.json`
4. **IF** — `overall` == `FAIL`
5. **HTTP Request** — POST to agent API (Phase 4):
   ```
   POST http://localhost:8000/api/incident
   Body: {{ $json }}
   ```
6. **Slack/Email** — alert with failed check IDs

---

## Workflow 3: Manual feature request (webhook)

**Nodes:**

1. **Webhook** — `POST /feature-request`
2. **Set** — body.message = user feature text
3. **HTTP Request** — POST to orchestrator:
   ```
   POST http://localhost:8000/api/run
   Body: { "message": "{{ $json.message }}" }
   ```
4. **Respond to Webhook** — return task plan JSON

Use this in portfolio demo: "Submit feature → PM agent plans → dev loop"

---

## Docker note (Mac)

To run shell scripts on your Mac from n8n in Docker, either:

- **Option A:** Use n8n native install (`npm install -g n8n`) instead of Docker
- **Option B:** Mount portfolio folder and call script inside container
- **Option C:** SSH node to localhost

**Easiest for beginners:** install n8n natively:

```bash
npm install -g n8n
n8n start
```

---

## Portfolio screenshot checklist

- [ ] Workflow canvas showing 3 workflows
- [ ] Execution log with green success
- [ ] Alert email/Slack on simulated failure
