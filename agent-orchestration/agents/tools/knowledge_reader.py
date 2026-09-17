"""Read documents from agent-orchestration/knowledge/."""
from __future__ import annotations

import sys
from pathlib import Path

_AGENTS = Path(__file__).resolve().parents[1]
if str(_AGENTS) not in sys.path:
    sys.path.insert(0, str(_AGENTS))

from config import KNOWLEDGE_PATH

ALLOWED_EXTENSIONS = {".md", ".txt"}


def list_knowledge_docs() -> list[str]:
    if not KNOWLEDGE_PATH.is_dir():
        return []
    return sorted(
        p.name
        for p in KNOWLEDGE_PATH.iterdir()
        if p.is_file() and p.suffix in ALLOWED_EXTENSIONS
    )


def read_knowledge_doc(filename: str, max_chars: int = 12000) -> dict:
    name = Path(filename).name
    if name != filename or ".." in filename:
        return {"error": "Invalid filename", "filename": filename}

    path = KNOWLEDGE_PATH / name
    if not path.is_file():
        available = list_knowledge_docs()
        return {
            "error": f"File not found: {name}",
            "available_docs": available,
        }

    text = path.read_text(encoding="utf-8")
    truncated = len(text) > max_chars
    if truncated:
        text = text[:max_chars] + "\n\n...[truncated]"

    return {
        "filename": name,
        "content": text,
        "truncated": truncated,
        "char_count": len(text),
    }


def main() -> None:
    import json

    if len(sys.argv) < 2:
        print(json.dumps({"available_docs": list_knowledge_docs()}, indent=2))
        raise SystemExit(0)
    print(json.dumps(read_knowledge_doc(sys.argv[1]), indent=2))


if __name__ == "__main__":
    main()
