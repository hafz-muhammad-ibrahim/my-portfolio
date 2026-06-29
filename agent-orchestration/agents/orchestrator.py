"""
Learning-mode orchestrator: PM → (Dev via Cursor) → QA → E2E offline loop.

No exchange accounts or live TA/DMS/TES required.

Usage:
  python orchestrator.py --offline
  python orchestrator.py --request "Add logging when readiness gate rejects"
  python orchestrator.py --review   # after you edit code in Cursor

Requires ANTHROPIC_API_KEY in .env for --request (PM planning).
QA/E2E run without API key.
"""
from __future__ import annotations

import argparse
import json
import os
import subprocess
import sys
from pathlib import Path

from dotenv import load_dotenv

load_dotenv()

PROMPTS_DIR = Path(__file__).parent.parent / "prompts"
E2E_DIR = Path(os.getenv("E2E_STANDARDS_PATH", "../e2e-standards")).resolve()
KNOWLEDGE_DIR = Path(__file__).parent.parent / "knowledge"


def load_prompt(name: str) -> str:
    path = PROMPTS_DIR / f"{name}.md"
    return path.read_text(encoding="utf-8") if path.exists() else ""


def load_knowledge_snippet(max_chars: int = 8000) -> str:
    parts = []
    for fname in ("SYSTEM_OVERVIEW.md", "LEARNING_MODE.md", "STANDARDS_CHECKLIST.md"):
        p = KNOWLEDGE_DIR / fname
        if p.exists():
            parts.append(f"## {fname}\n{p.read_text(encoding='utf-8')}")
    text = "\n\n".join(parts)
    return text[:max_chars]


def run_offline_e2e() -> dict:
    script = E2E_DIR / "run_offline.sh"
    if not script.exists():
        return {"overall": "FAIL", "error": f"Missing {script}"}
    subprocess.run(["bash", str(script)], cwd=str(E2E_DIR), check=False)
    report_path = E2E_DIR / "reports" / "latest.json"
    if report_path.exists():
        return json.loads(report_path.read_text(encoding="utf-8"))
    return {"overall": "FAIL", "error": "No report generated"}


def pm_plan_stub(report: dict) -> dict:
    failed = [c for c in report.get("checks", []) if c.get("status") == "FAIL"]
    tasks = []
    for i, check in enumerate(failed, start=1):
        cid = check.get("id", "unknown")
        agent = "dev_dms" if "dms" in cid or "filter" in cid else "dev_tes" if "tes" in cid or "exec" in cid else "dev_ta"
        tasks.append({
            "agent": agent,
            "priority": i,
            "description": f"Fix: {cid} — {check.get('detail', '')}",
            "acceptance": f"{cid} PASS on next run_offline.sh",
        })
    if not tasks:
        tasks = [{"agent": "human", "priority": 1, "description": "All offline checks passed — review and commit", "acceptance": "You merge"}]
    return {"summary": f"offline overall={report.get('overall')}", "tasks": tasks}


def pm_plan_claude(user_request: str, e2e_report: dict | None = None) -> dict:
    api_key = os.getenv("ANTHROPIC_API_KEY", "").strip()
    if not api_key:
        return {
            "summary": "No ANTHROPIC_API_KEY — using stub plan",
            "tasks": [
                {"agent": "dev_dms", "priority": 1, "description": user_request, "acceptance": "run_offline.sh PASS"},
                {"agent": "qa", "priority": 2, "description": "go test affected packages", "acceptance": "exit 0"},
                {"agent": "e2e", "priority": 3, "description": "./run_offline.sh", "acceptance": "overall PASS"},
            ],
            "cursor_hint": f"Open Cursor and implement: {user_request}",
        }
    try:
        import anthropic
    except ImportError:
        return pm_plan_stub(e2e_report or {"checks": []})

    system = load_prompt("pm_agent") + "\n\n" + load_knowledge_snippet()
    user_content = f"User request: {user_request}\n\n"
    if e2e_report:
        user_content += f"Latest E2E report:\n{json.dumps(e2e_report, indent=2)}\n\n"
    user_content += "Respond with JSON only (see output format in system prompt)."

    client = anthropic.Anthropic(api_key=api_key)
    msg = client.messages.create(
        model=os.getenv("ANTHROPIC_MODEL", "claude-sonnet-4-20250514"),
        max_tokens=2048,
        system=system,
        messages=[{"role": "user", "content": user_content}],
    )
    text = msg.content[0].text if msg.content else "{}"
    # Extract JSON from response
    start = text.find("{")
    end = text.rfind("}") + 1
    if start >= 0 and end > start:
        return json.loads(text[start:end])
    return {"summary": text, "tasks": [], "raw": text}


def print_plan(plan: dict) -> None:
    print("\n" + "=" * 60)
    print("PM AGENT PLAN")
    print("=" * 60)
    print(json.dumps(plan, indent=2))
    if plan.get("cursor_hint"):
        print("\n--- Cursor (Dev Agent) ---")
        print(plan["cursor_hint"])
    else:
        print("\n--- Next: Dev Agent (Cursor) ---")
        for t in plan.get("tasks", []):
            if t.get("agent", "").startswith("dev_"):
                print(f"  [{t['agent']}] {t.get('description', '')}")
                if t.get("files"):
                    print(f"    files: {t['files']}")
    print("\n--- Then run QA + E2E ---")
    print(f"  cd {E2E_DIR} && ./run_offline.sh")


def full_learning_loop(user_request: str | None = None) -> int:
    print("Step 1/3: E2E offline standards...")
    report = run_offline_e2e()
    print(json.dumps(report, indent=2))

    print("\nStep 2/3: PM agent planning...")
    if user_request:
        plan = pm_plan_claude(user_request, report)
    elif report.get("overall") == "FAIL":
        plan = pm_plan_claude("Fix all failed offline E2E checks", report)
    else:
        plan = pm_plan_stub(report)

    print_plan(plan)

    print("\nStep 3/3: After Dev (Cursor) edits, re-run:")
    print(f"  cd {E2E_DIR} && ./run_offline.sh")
    return 0 if report.get("overall") == "PASS" and not user_request else 0


def main() -> None:
    parser = argparse.ArgumentParser(description="Trading platform agent orchestrator (learning mode)")
    parser.add_argument("--offline", action="store_true", help="Run offline E2E + PM plan")
    parser.add_argument("--request", "-r", type=str, help="Feature request for PM agent")
    parser.add_argument("message", nargs="*", help="Optional message")
    args = parser.parse_args()

    user_request = args.request or (" ".join(args.message) if args.message else None)

    if args.offline or user_request or not sys.argv[1:]:
        full_learning_loop(user_request)
        return

    parser.print_help()


if __name__ == "__main__":
    main()
