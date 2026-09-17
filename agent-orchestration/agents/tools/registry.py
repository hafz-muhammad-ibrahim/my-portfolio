"""Anthropic tool schemas and execution dispatch."""
from __future__ import annotations

import json
from typing import Any

from tools.knowledge_reader import list_knowledge_docs, read_knowledge_doc
from tools.run_offline_tests import run_offline_tests

TOOL_DEFINITIONS: list[dict[str, Any]] = [
    {
        "name": "run_offline_tests",
        "description": (
            "Run the offline E2E test suite (go test on TA, DMS, TES). "
            "No live exchanges or services required. Returns JSON with overall PASS/FAIL and per-check results."
        ),
        "input_schema": {
            "type": "object",
            "properties": {},
            "required": [],
        },
    },
    {
        "name": "read_knowledge_doc",
        "description": (
            "Read a markdown document from the project knowledge base. "
            f"Available docs include: {', '.join(list_knowledge_docs()) or 'SYSTEM_OVERVIEW.md, STANDARDS_CHECKLIST.md, LEARNING_MODE.md'}"
        ),
        "input_schema": {
            "type": "object",
            "properties": {
                "filename": {
                    "type": "string",
                    "description": "Knowledge file name, e.g. SYSTEM_OVERVIEW.md or STANDARDS_CHECKLIST.md",
                }
            },
            "required": ["filename"],
        },
    },
    {
        "name": "list_knowledge_docs",
        "description": "List all available knowledge base documents.",
        "input_schema": {
            "type": "object",
            "properties": {},
            "required": [],
        },
    },
]


def execute_tool(name: str, tool_input: dict[str, Any]) -> str:
    """Run a tool by name; return JSON string for the model."""
    try:
        if name == "run_offline_tests":
            result = run_offline_tests()
        elif name == "read_knowledge_doc":
            filename = tool_input.get("filename", "")
            result = read_knowledge_doc(str(filename))
        elif name == "list_knowledge_docs":
            result = {"docs": list_knowledge_docs()}
        else:
            result = {"error": f"Unknown tool: {name}"}
    except Exception as exc:  # noqa: BLE001 — tool errors go back to the model
        result = {"error": str(exc), "tool": name}

    return json.dumps(result, indent=2)
