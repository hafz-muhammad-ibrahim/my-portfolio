"""
Day 2 — Raw Anthropic tool-calling loop (no LangGraph).

The model decides when to call tools. You execute them and feed results back
until the model returns a final text answer.

Usage:
  python raw_tool_agent.py "Run offline E2E standards and summarize failures"
  python raw_tool_agent.py "What is the readiness gate? Read STANDARDS_CHECKLIST.md"
  python raw_tool_agent.py --dry-run "..."   # no API key — shows tool wiring only
"""
from __future__ import annotations

import argparse
import json
import sys
from typing import Any

from dotenv import load_dotenv

load_dotenv()

from config import ANTHROPIC_API_KEY, ANTHROPIC_MODEL, MAX_AGENT_ITERATIONS
from tools.registry import TOOL_DEFINITIONS, execute_tool

SYSTEM_PROMPT = """You are a QA and standards assistant for a trading platform portfolio project.

You have tools to:
- run_offline_tests — run go test checks on TA, DMS, TES (no live exchanges)
- read_knowledge_doc — read project knowledge files
- list_knowledge_docs — list available knowledge files

When asked about test status, always call run_offline_tests first.
When asked about architecture or standards, read the relevant knowledge doc.
Summarize results clearly. If tests FAIL, list failed check ids and suggest next steps.
Do not invent test results — only report what tools return."""


def _extract_tool_uses(response: Any) -> list[dict]:
    uses = []
    for block in getattr(response, "content", []) or []:
        if getattr(block, "type", None) == "tool_use":
            uses.append({"id": block.id, "name": block.name, "input": block.input})
    return uses


def _text_blocks(response: Any) -> str:
    parts = []
    for block in getattr(response, "content", []) or []:
        if getattr(block, "type", None) == "text":
            parts.append(block.text)
    return "\n".join(parts).strip()


def run_agent(user_message: str, *, max_iterations: int | None = None, verbose: bool = True) -> str:
    if not ANTHROPIC_API_KEY:
        raise RuntimeError("Set ANTHROPIC_API_KEY in agents/.env (see .env.example)")

    import anthropic

    client = anthropic.Anthropic(api_key=ANTHROPIC_API_KEY)
    messages: list[dict[str, Any]] = [{"role": "user", "content": user_message}]
    limit = max_iterations or MAX_AGENT_ITERATIONS

    for iteration in range(1, limit + 1):
        if verbose:
            print(f"\n--- Iteration {iteration} ---")

        response = client.messages.create(
            model=ANTHROPIC_MODEL,
            max_tokens=4096,
            system=SYSTEM_PROMPT,
            tools=TOOL_DEFINITIONS,
            messages=messages,
        )

        stop = response.stop_reason
        if verbose:
            print(f"stop_reason: {stop}")

        tool_uses = _extract_tool_uses(response)
        if stop == "tool_use" and tool_uses:
            messages.append({"role": "assistant", "content": response.content})

            tool_results = []
            for tu in tool_uses:
                if verbose:
                    print(f"  tool: {tu['name']}({json.dumps(tu['input'])})")
                output = execute_tool(tu["name"], tu["input"] or {})
                if verbose and tu["name"] == "run_offline_tests":
                    try:
                        parsed = json.loads(output)
                        print(f"  → overall: {parsed.get('overall', '?')}")
                    except json.JSONDecodeError:
                        pass
                tool_results.append(
                    {
                        "type": "tool_result",
                        "tool_use_id": tu["id"],
                        "content": output,
                    }
                )

            messages.append({"role": "user", "content": tool_results})
            continue

        answer = _text_blocks(response)
        if answer:
            return answer
        return "(No text response from model)"

    return f"Stopped after {limit} iterations without a final answer."


def dry_run_tools(user_message: str) -> None:
    """Verify tool wiring without calling the API."""
    print("DRY RUN — tools available:")
    for t in TOOL_DEFINITIONS:
        print(f"  - {t['name']}: {t['description'][:80]}...")
    print(f"\nUser message: {user_message}")
    print("\nExecuting run_offline_tests locally:")
    print(execute_tool("run_offline_tests", {}))


def main() -> None:
    parser = argparse.ArgumentParser(description="Raw tool-calling agent (Day 2)")
    parser.add_argument("message", nargs="*", help="User request")
    parser.add_argument("--dry-run", action="store_true", help="Test tools without API")
    parser.add_argument("--max-iter", type=int, default=None, help="Max tool loop iterations")
    parser.add_argument("-q", "--quiet", action="store_true", help="Less logging")
    args = parser.parse_args()

    user_message = " ".join(args.message).strip()
    if not user_message:
        user_message = "Run offline E2E standards and give me a short summary."

    if args.dry_run:
        dry_run_tools(user_message)
        return

    try:
        answer = run_agent(user_message, max_iterations=args.max_iter, verbose=not args.quiet)
    except RuntimeError as exc:
        print(f"ERROR: {exc}")
        raise SystemExit(1)

    print("\n" + "=" * 60)
    print("FINAL ANSWER")
    print("=" * 60)
    print(answer)


if __name__ == "__main__":
    main()
