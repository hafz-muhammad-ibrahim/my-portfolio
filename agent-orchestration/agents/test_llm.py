"""
Day 1 — Smoke test: verify ANTHROPIC_API_KEY and model access.

Usage:
  python test_llm.py
"""
from __future__ import annotations

import sys

from dotenv import load_dotenv

load_dotenv()

from config import ANTHROPIC_API_KEY, ANTHROPIC_MODEL


def main() -> None:
    if not ANTHROPIC_API_KEY:
        print("ERROR: Set ANTHROPIC_API_KEY in agents/.env")
        raise SystemExit(1)

    try:
        import anthropic
    except ImportError:
        print("ERROR: pip install anthropic")
        raise SystemExit(1)

    client = anthropic.Anthropic(api_key=ANTHROPIC_API_KEY)
    msg = client.messages.create(
        model=ANTHROPIC_MODEL,
        max_tokens=64,
        messages=[{"role": "user", "content": "Reply with exactly: API OK"}],
    )
    text = msg.content[0].text if msg.content else ""
    print(f"Model: {ANTHROPIC_MODEL}")
    print(f"Response: {text.strip()}")
    print("SUCCESS: Anthropic API is working.")


if __name__ == "__main__":
    main()
